/**
 * ViteMeals Push Notification + OneTable Worker
 *
 * Environment variables to set in Cloudflare dashboard:
 *   VAPID_PUBLIC_KEY   — your VAPID public key (base64url)
 *   VAPID_PRIVATE_KEY  — your VAPID private key (base64url)
 *   VAPID_SUBJECT      — contact email, e.g. "you@example.com"
 *   NOTIFICATION_SECRET — any random string; must match src/notifications.ts
 *   FIREBASE_SERVICE_ACCOUNT_EMAIL — client_email from your Firebase service account JSON
 *   FIREBASE_SERVICE_ACCOUNT_KEY   — private_key from the same JSON (PEM, real newlines)
 */

import { jwtVerify, createRemoteJWKSet, SignJWT, importPKCS8 } from "jose";

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

// ─── Firebase auth (caller identity + admin access) ───────────────────────────
// These two endpoints act on someone else's OneTable token (the host's, or a
// removed guest's), which client-side security rules correctly forbid reading
// directly. This section verifies who's actually calling (their Firebase ID
// token) and mints the worker's own admin-level Firebase access (via a service
// account) so it — not the browser — can read the token it needs, after
// checking the caller is actually allowed to trigger that action.

const FIREBASE_PROJECT_ID = "vitepotlock";
const FIREBASE_DB_URL = "https://vitepotlock-default-rtdb.firebaseio.com";

const firebaseJWKS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com")
);

/** Verifies a Firebase Auth ID token and returns the caller's Firebase uid. */
async function verifyFirebaseIdToken(idToken) {
  const { payload } = await jwtVerify(idToken, firebaseJWKS, {
    issuer: `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`,
    audience: FIREBASE_PROJECT_ID,
  });
  return payload.sub;
}

let cachedAdminToken = null; // { accessToken, expiresAt } — reused across requests in this isolate

/** Mints (and caches) an OAuth2 access token for the service account, scoped to RTDB. */
async function getAdminAccessToken(env) {
  const now = Math.floor(Date.now() / 1000);
  if (cachedAdminToken && cachedAdminToken.expiresAt > now + 60) {
    return cachedAdminToken.accessToken;
  }

  const privateKey = await importPKCS8(env.FIREBASE_SERVICE_ACCOUNT_KEY, "RS256");
  const assertion = await new SignJWT({
    scope: "https://www.googleapis.com/auth/firebase.database https://www.googleapis.com/auth/userinfo.email",
  })
    .setProtectedHeader({ alg: "RS256" })
    .setIssuer(env.FIREBASE_SERVICE_ACCOUNT_EMAIL)
    .setSubject(env.FIREBASE_SERVICE_ACCOUNT_EMAIL)
    .setAudience("https://oauth2.googleapis.com/token")
    .setIssuedAt(now)
    .setExpirationTime(now + 3600)
    .sign(privateKey);

  const resp = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  if (!resp.ok) throw new Error(`Admin token mint failed ${resp.status}: ${await resp.text()}`);
  const data = await resp.json();
  cachedAdminToken = { accessToken: data.access_token, expiresAt: now + data.expires_in };
  return cachedAdminToken.accessToken;
}

/** Admin-privileged read — bypasses RTDB security rules, so callers must be pre-authorized. */
async function dbGet(path, accessToken) {
  const resp = await fetch(`${FIREBASE_DB_URL}/${path}.json`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!resp.ok) throw new Error(`Firebase read failed ${resp.status}: ${await resp.text()}`);
  return resp.json();
}

/** Admin-privileged delete — same caveat as dbGet. */
async function dbDelete(path, accessToken) {
  const resp = await fetch(`${FIREBASE_DB_URL}/${path}.json`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!resp.ok) throw new Error(`Firebase delete failed ${resp.status}: ${await resp.text()}`);
}

/** Verifies the request's Authorization: Bearer <firebaseIdToken> and resolves it to a numeric user id. */
async function resolveCallerNumericId(request, accessToken) {
  const authHeader = request.headers.get("Authorization") || "";
  const idToken = authHeader.replace(/^Bearer\s+/i, "");
  if (!idToken) throw new Error("Missing Authorization bearer token");
  const uid = await verifyFirebaseIdToken(idToken);
  const numericId = await dbGet(`uid_to_id/${uid}`, accessToken);
  if (!numericId) throw new Error("No numeric id mapped for this account");
  return String(numericId);
}

// ─── Worker Entry Point ───────────────────────────────────────────────────────

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST",
  "Access-Control-Allow-Headers": "Content-Type, X-Notification-Secret, Authorization",
};

const OT_API = "https://app-prod.internal.onetable.org/graphql";
const OT_FINGERPRINT = "d15058657f86f919b51f5c6912b88d5c";

function jsonError(message, status) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

/** Shared OneTable GraphQL call, used by both the generic proxy and the host-mediated routes below. */
async function callOneTable(token, operationName, variables, query) {
  const resp = await fetch(OT_API, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "x-browser-fingerprint": OT_FINGERPRINT,
    },
    body: JSON.stringify({ operationName, variables, query }),
  });
  const bodyText = await resp.text();
  if (!resp.ok) throw new Error(`OneTable upstream ${resp.status}: ${bodyText}`);
  return JSON.parse(bodyText);
}

const ACCEPT_RESERVATION_QUERY = `
  mutation acceptReservation($id: Int, $reservationIds: [Int!], $message: Html) {
    acceptReservation(input: { id: $id, reservationIds: $reservationIds, message: $message }) {
      reservation { id state profile { id } event { id } }
      errors { reservationId message }
    }
  }
`;

const CANCEL_RESERVATION_QUERY = `
  mutation cancelReservation($reservationId: Int!, $cancelReason: String, $cancelReasonText: String) {
    cancelReservation(input: {
      id: $reservationId,
      cancelReason: $cancelReason,
      cancelReasonText: $cancelReasonText
    }) {
      reservation { id state }
      errors { message }
    }
  }
`;

// ─── Client-side error logging ────────────────────────────────────────────────
// The app can't write to Firebase to report its own auth failures (the very
// thing most worth logging is exactly the case where the client isn't
// authenticated yet), so it posts here instead. Logged to the console (visible
// live via `wrangler tail`) and persisted to KV for 30 days so they're visible
// after the fact too.

const LOG_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days
const MAX_LOG_BODY_BYTES = 8 * 1024;

function truncate(value, maxLen) {
  if (typeof value !== "string") return value;
  return value.length > maxLen ? value.slice(0, maxLen) + "…" : value;
}

async function handleClientLog(request, env) {
  const rawBody = await request.text();
  if (rawBody.length > MAX_LOG_BODY_BYTES) {
    return jsonError("Log payload too large", 413);
  }

  let parsed;
  try {
    parsed = JSON.parse(rawBody);
  } catch {
    return jsonError("Invalid JSON", 400);
  }

  const entry = {
    receivedAt: new Date().toISOString(),
    level: ["error", "warn", "info"].includes(parsed.level) ? parsed.level : "error",
    message: truncate(String(parsed.message ?? ""), 500),
    context: parsed.context && typeof parsed.context === "object" ? parsed.context : undefined,
    userAgent: truncate(request.headers.get("User-Agent") ?? "", 300),
    url: truncate(String(parsed.url ?? ""), 300),
    ip: request.headers.get("CF-Connecting-IP") ?? undefined,
  };

  console.error("[client-log]", JSON.stringify(entry));

  const key = `log:${entry.receivedAt}:${crypto.randomUUID().slice(0, 8)}`;
  await env.CLIENT_LOGS.put(key, JSON.stringify(entry), { expirationTtl: LOG_TTL_SECONDS });

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

/** Lists the most recent client logs — for you to check after the fact, not for the app. */
async function handleListLogs(request, env) {
  const url = new URL(request.url);
  const limit = Math.min(Number(url.searchParams.get("limit")) || 50, 200);

  // KV's list() returns keys oldest-first with no descending option, so to
  // get the most recent N we have to walk the full (bounded) key set first,
  // then take the tail — a fixed `limit` on list() would give the oldest N.
  let allKeys = [];
  let cursor;
  do {
    const page = await env.CLIENT_LOGS.list({ prefix: "log:", cursor });
    allKeys.push(...page.keys);
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor && allKeys.length < 5000);

  const recentKeys = allKeys.slice(-limit).reverse();
  const entries = await Promise.all(
    recentKeys.map(async (k) => JSON.parse((await env.CLIENT_LOGS.get(k.name)) ?? "null"))
  );
  return new Response(JSON.stringify({ entries }, null, 2), {
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

    const url = new URL(request.url);

    // Reading logs uses its own secret, deliberately never shipped to the
    // browser (unlike NOTIFICATION_SECRET, which the client bundle has to
    // know just to send a push notification or a log entry). If this used
    // NOTIFICATION_SECRET too, anyone reading the app's public JS could pull
    // it out and read every logged entry — including IP addresses.
    if (url.pathname === "/logs" && request.method === "GET") {
      if (request.headers.get("X-Logs-Secret") !== env.LOGS_READ_SECRET) {
        return new Response("Unauthorized", { status: 401, headers: corsHeaders });
      }
      return handleListLogs(request, env);
    }

    if (request.headers.get("X-Notification-Secret") !== env.NOTIFICATION_SECRET) {
      return new Response("Unauthorized", { status: 401, headers: corsHeaders });
    }

    if (url.pathname === "/log" && request.method === "POST") {
      return handleClientLog(request, env);
    }

    if (request.method !== "POST") return new Response("Method not allowed", { status: 405, headers: corsHeaders });

    // ─── Host-mediated OneTable actions ───────────────────────────────────────
    // These read someone else's onetable_token (the host's, or a removed
    // guest's) using the worker's admin access, after verifying the caller's
    // Firebase identity and that they're actually authorized for this meal.

    if (url.pathname === "/onetable/host-accept-reservation") {
      try {
        const { mealId, reservationId } = await request.json();
        const accessToken = await getAdminAccessToken(env);
        const callerId = await resolveCallerNumericId(request, accessToken);

        const meal = await dbGet(`meal_events/${mealId}`, accessToken);
        if (!meal) return jsonError("Meal not found", 404);
        if (meal.onetable_reservations?.[callerId] !== reservationId) {
          return jsonError("That reservation doesn't belong to you", 403);
        }

        const hostIds = Object.entries(meal.participants || {})
          .filter(([, p]) => p.role === "host")
          .map(([id]) => id);

        for (const hostId of hostIds) {
          const hostToken = await dbGet(`private/${hostId}/onetable_token`, accessToken);
          if (hostToken) {
            const data = await callOneTable(hostToken, "acceptReservation", {
              id: reservationId,
              reservationIds: [],
              message: "",
            }, ACCEPT_RESERVATION_QUERY);
            if (data.errors?.length) return jsonError(data.errors[0].message, 502);
            const errs = data.data?.acceptReservation?.errors;
            if (errs?.length) return jsonError(errs[0].message, 502);
            return new Response(JSON.stringify({ success: true }), {
              headers: { "Content-Type": "application/json", ...corsHeaders },
            });
          }
        }
        return jsonError("No host has a connected OneTable account", 409);
      } catch (err) {
        console.error("host-accept-reservation error:", err);
        return jsonError(err.message, 500);
      }
    }

    if (url.pathname === "/onetable/host-cancel-reservation") {
      try {
        const { mealId, removedUserId, reservationId } = await request.json();
        const accessToken = await getAdminAccessToken(env);
        const callerId = await resolveCallerNumericId(request, accessToken);

        const meal = await dbGet(`meal_events/${mealId}`, accessToken);
        if (!meal) return jsonError("Meal not found", 404);
        if (meal.participants?.[callerId]?.role !== "host") {
          return jsonError("Only a host can do this", 403);
        }
        if (meal.onetable_reservations?.[removedUserId] !== reservationId) {
          return jsonError("Reservation mismatch", 403);
        }

        const removedToken = await dbGet(`private/${removedUserId}/onetable_token`, accessToken);
        if (removedToken) {
          const data = await callOneTable(removedToken, "cancelReservation", {
            reservationId,
            cancelReason: "",
            cancelReasonText: "",
          }, CANCEL_RESERVATION_QUERY);
          if (data.errors?.length) return jsonError(data.errors[0].message, 502);
        }
        await dbDelete(`meal_events/${mealId}/onetable_reservations/${removedUserId}`, accessToken);
        return new Response(JSON.stringify({ success: true }), {
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      } catch (err) {
        console.error("host-cancel-reservation error:", err);
        return jsonError(err.message, 500);
      }
    }

    // ─── OneTable API proxy ───────────────────────────────────────────────────
    if (url.pathname === "/onetable") {
      try {
        const { token, operationName, variables, query } = await request.json();
        const data = await callOneTable(token, operationName, variables, query);
        return new Response(JSON.stringify(data), {
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      } catch (err) {
        console.error("OneTable proxy error:", err);
        return jsonError(err.message, 502);
      }
    }

    // ─── Push notifications (default route) ──────────────────────────────────
    try {
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
