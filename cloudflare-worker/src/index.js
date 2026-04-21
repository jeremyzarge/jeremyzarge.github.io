/**
 * ViteMeals Push Notification Worker
 * Pure Web Crypto — no npm packages required.
 *
 * Environment variables to set in Cloudflare dashboard:
 *   VAPID_PUBLIC_KEY   — your VAPID public key (base64url)
 *   VAPID_PRIVATE_KEY  — your VAPID private key (base64url)
 *   VAPID_SUBJECT      — contact email, e.g. "you@example.com"
 *   NOTIFICATION_SECRET — any random string; must match src/notifications.ts
 */

// ─── Utilities ────────────────────────────────────────────────────────────────

const enc = new TextEncoder();

function b64url(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function fromB64url(str) {
  const s = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = s.length % 4 ? "=".repeat(4 - (s.length % 4)) : "";
  return Uint8Array.from(atob(s + pad), (c) => c.charCodeAt(0));
}

function concat(...arrays) {
  const total = arrays.reduce((n, a) => n + a.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const a of arrays) { out.set(a, offset); offset += a.length; }
  return out;
}

// ─── HKDF (SHA-256) ───────────────────────────────────────────────────────────

async function hkdfExtract(salt, ikm) {
  const key = await crypto.subtle.importKey("raw", salt, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, ikm));
}

async function hkdfExpand(prk, info, length) {
  const key = await crypto.subtle.importKey("raw", prk, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const out = new Uint8Array(length);
  let prev = new Uint8Array(0);
  let offset = 0;
  for (let i = 1; offset < length; i++) {
    prev = new Uint8Array(await crypto.subtle.sign("HMAC", key, concat(prev, info, new Uint8Array([i]))));
    out.set(prev.slice(0, Math.min(prev.length, length - offset)), offset);
    offset += prev.length;
  }
  return out;
}

// ─── VAPID JWT (ES256) ────────────────────────────────────────────────────────

async function createVapidJWT(audience, subject, vapidPublicKeyB64, vapidPrivateKeyB64, expiration) {
  const header = b64url(enc.encode(JSON.stringify({ typ: "JWT", alg: "ES256" })));
  const payload = b64url(enc.encode(JSON.stringify({ aud: audience, exp: expiration, sub: subject })));
  const unsigned = `${header}.${payload}`;

  // Build JWK from raw public (x,y) and private (d) components
  const pubBytes = fromB64url(vapidPublicKeyB64); // 0x04 || x(32) || y(32)
  const signingKey = await crypto.subtle.importKey(
    "jwk",
    {
      kty: "EC", crv: "P-256",
      x: b64url(pubBytes.slice(1, 33)),
      y: b64url(pubBytes.slice(33, 65)),
      d: vapidPrivateKeyB64,
      ext: true,
    },
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign"]
  );

  const sig = await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, signingKey, enc.encode(unsigned));
  return `${unsigned}.${b64url(new Uint8Array(sig))}`;
}

// ─── Payload Encryption (RFC 8291 aes128gcm) ──────────────────────────────────

async function encryptPayload(p256dhB64, authB64, plaintext) {
  const uaPublicKey = fromB64url(p256dhB64);
  const authSecret = fromB64url(authB64);

  const ephemeral = await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"]);
  const asPublicKey = new Uint8Array(await crypto.subtle.exportKey("raw", ephemeral.publicKey));

  const uaECDH = await crypto.subtle.importKey("raw", uaPublicKey, { name: "ECDH", namedCurve: "P-256" }, false, []);
  const ecdhSecret = new Uint8Array(await crypto.subtle.deriveBits({ name: "ECDH", public: uaECDH }, ephemeral.privateKey, 256));

  // PRK_key = HKDF-Extract(auth_secret, ecdh_secret)
  const prkKey = await hkdfExtract(authSecret, ecdhSecret);

  // IKM = HKDF-Expand(PRK_key, "WebPush: info\0" || ua_pub || as_pub, 32)
  const ikm = await hkdfExpand(prkKey, concat(enc.encode("WebPush: info\0"), uaPublicKey, asPublicKey), 32);

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const prk = await hkdfExtract(salt, ikm);

  const cek = await hkdfExpand(prk, enc.encode("Content-Encoding: aes128gcm\0"), 16);
  const nonce = await hkdfExpand(prk, enc.encode("Content-Encoding: nonce\0"), 12);

  const aesKey = await crypto.subtle.importKey("raw", cek, { name: "AES-GCM" }, false, ["encrypt"]);
  const ciphertext = new Uint8Array(await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: nonce },
    aesKey,
    concat(enc.encode(plaintext), new Uint8Array([0x02])) // plaintext + record delimiter
  ));

  // Body: salt(16) || rs(4 BE = 4096) || idlen(1 = 65) || as_public(65) || ciphertext
  const rs = new Uint8Array(4);
  new DataView(rs.buffer).setUint32(0, 4096, false);
  return concat(salt, rs, new Uint8Array([65]), asPublicKey, ciphertext);
}

// ─── Send one Web Push ────────────────────────────────────────────────────────

async function sendWebPush(subscription, payloadStr, vapidPublicKey, vapidPrivateKey, subject) {
  const origin = new URL(subscription.endpoint).origin;
  const exp = Math.floor(Date.now() / 1000) + 43200; // 12 h
  const jwt = await createVapidJWT(origin, subject, vapidPublicKey, vapidPrivateKey, exp);
  const body = await encryptPayload(subscription.keys.p256dh, subscription.keys.auth, payloadStr);

  const res = await fetch(subscription.endpoint, {
    method: "POST",
    headers: {
      Authorization: `vapid t=${jwt},k=${vapidPublicKey}`,
      "Content-Type": "application/octet-stream",
      "Content-Encoding": "aes128gcm",
      TTL: "86400",
    },
    body,
  });

  if (!res.ok && res.status !== 201) {
    throw new Error(`Push failed ${res.status}: ${await res.text()}`);
  }
}

// ─── Worker Entry Point ───────────────────────────────────────────────────────

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST",
  "Access-Control-Allow-Headers": "Content-Type, X-Notification-Secret",
};

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
    if (request.method !== "POST") return new Response("Method not allowed", { status: 405, headers: corsHeaders });

    try {
      if (request.headers.get("X-Notification-Secret") !== env.NOTIFICATION_SECRET) {
        return new Response("Unauthorized", { status: 401, headers: corsHeaders });
      }

      const { subscriptions, notification } = await request.json();
      const subject = `mailto:${env.VAPID_SUBJECT}`;
      const payload = JSON.stringify(notification);

      const results = await Promise.allSettled(
        subscriptions.map((sub) => sendWebPush(sub, payload, env.VAPID_PUBLIC_KEY, env.VAPID_PRIVATE_KEY, subject))
      );

      const failed = results.filter((r) => r.status === "rejected");
      if (failed.length > 0) console.error("Failed pushes:", failed.map((r) => r.reason?.message));

      return new Response(
        JSON.stringify({
          sent: results.filter((r) => r.status === "fulfilled").length,
          failed: failed.length,
        }),
        { headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    } catch (err) {
      console.error("Worker error:", err);
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
  },
};
