import { useEffect, useRef, useState } from "react";
import { ref, set } from "firebase/database";
import { rtdb } from "../firebaseClient";
import { verifyOTToken } from "../onetableService";

interface OneTableConnectProps {
  userId: string;
  existingToken?: string;
  onSaved: () => void;
  onClose: () => void;
}

// Builds a bookmarklet baked with the current app origin at drag time.
// Token is delivered via postMessage to ViteMeals — never touches the URL.
function buildBookmarklet(appOrigin: string): string {
  const o = JSON.stringify(appOrigin);
  return `javascript:(function(){var O=${o},jwt=/eyJ[A-Za-z0-9_-]{4,}\\.[A-Za-z0-9_-]{4,}\\.[A-Za-z0-9_-]{4,}/;function send(t){var w=window.open(O,'_vitemeals_ot');if(!w)return;var i=0,iv=setInterval(function(){try{w.postMessage({ot_token:t},O);}catch(e){}if(++i>30)clearInterval(iv);},200);}var tok=null;try{for(var i=0;i<sessionStorage.length;i++){var v=sessionStorage.getItem(sessionStorage.key(i));var mg=v&&v.match(jwt);if(mg){tok=mg[0];break;}}if(!tok)for(var i=0;i<localStorage.length;i++){var v=localStorage.getItem(localStorage.key(i));var mg=v&&v.match(jwt);if(mg){tok=mg[0];break;}}if(!tok){var mg=document.cookie.match(jwt);if(mg)tok=mg[0];}}catch(e){}if(tok){send(tok);return;}if(document.getElementById('_vm'))return;var cnt=0,d=document.createElement('div');d.id='_vm';d.style.cssText='position:fixed;top:12px;right:12px;z-index:99999;background:#f97316;color:#fff;padding:12px 18px;border-radius:12px;font:700 13px/1.4 sans-serif;box-shadow:0 4px 16px rgba(0,0,0,.35);max-width:300px;';var m=document.createElement('div');m.innerHTML='<b>ViteMeals</b><br>Scroll down to load a request...';var x=document.createElement('span');x.textContent='\\u00d7';x.style.cssText='float:right;cursor:pointer;margin-left:8px;opacity:0.8;font-size:16px;';d.appendChild(m);d.appendChild(x);var _f=window.fetch,_xr=XMLHttpRequest.prototype.setRequestHeader,_ha=Headers.prototype.append,_hs=Headers.prototype.set;function cleanup(){d.remove();window.fetch=_f;XMLHttpRequest.prototype.setRequestHeader=_xr;Headers.prototype.append=_ha;Headers.prototype.set=_hs;}function go(t){if(!jwt.test(t)||!document.getElementById('_vm'))return;cleanup();send(t);}x.onclick=cleanup;document.body.appendChild(d);window.fetch=function(u,o){try{cnt++;m.innerHTML='<b>ViteMeals</b><br>Listening...('+cnt+' req)';var h=(o&&o.headers)||{},a=h instanceof Headers?h.get('authorization'):h.Authorization||h.authorization||'';if(a)go(a.replace(/^[Bb]earer\\s+/,''));}catch(e){}return _f.apply(this,arguments);};XMLHttpRequest.prototype.setRequestHeader=function(n,v){if(n.toLowerCase()==='authorization'&&v)go(v.replace(/^[Bb]earer\\s+/,''));return _xr.apply(this,arguments);};Headers.prototype.append=function(n,v){if(n.toLowerCase()==='authorization'&&v)go(v.replace(/^[Bb]earer\\s+/,''));return _ha.apply(this,arguments);};Headers.prototype.set=function(n,v){if(n.toLowerCase()==='authorization'&&v)go(v.replace(/^[Bb]earer\\s+/,''));return _hs.apply(this,arguments);};})();`;
}

type Step = "bookmarklet" | "manual";

export default function OneTableConnect({
  userId,
  existingToken,
  onSaved,
  onClose,
}: OneTableConnectProps) {
  const isMobile = window.innerWidth <= 768;
  const [step, setStep] = useState<Step>("bookmarklet");
  const bookmarkletCode = buildBookmarklet(window.location.origin);
  // Set href via DOM to avoid React's javascript: URL warning
  const bookmarkAnchorRef = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    if (bookmarkAnchorRef.current) {
      bookmarkAnchorRef.current.setAttribute("href", bookmarkletCode);
    }
  }, [bookmarkletCode]);

  const [manualToken, setManualToken] = useState(existingToken || "");
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleVerifyManual = async () => {
    if (!manualToken.trim()) return;
    setVerifying(true);
    setVerifyError(null);
    const valid = await verifyOTToken(manualToken.trim());
    setVerifying(false);
    if (!valid) { setVerifyError("Token invalid or expired."); return; }
    setSaving(true);
    try {
      await set(ref(rtdb, `users/${userId}/onetable_token`), manualToken.trim());
      onSaved();
    } catch (err: any) {
      alert("Failed to save: " + err.message);
    } finally {
      setSaving(false);
    }
  };


  const copyBookmarklet = async () => {
    try {
      await navigator.clipboard.writeText(bookmarkletCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 3000,
        padding: 20,
        backdropFilter: "blur(4px)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "white",
          borderRadius: 20,
          padding: 32,
          maxWidth: 460,
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
          border: "4px solid transparent",
          backgroundImage:
            "linear-gradient(white, white), linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={headingStyle}>OneTable Integration</h2>

        {/* ── Bookmarklet step ── */}
        {step === "bookmarklet" && (
          <>
            <p style={subtitleStyle}>
              Use the ViteMeals bookmark to grab your token from OneTable automatically.
            </p>

            {isMobile ? (
              /* ── Mobile instructions (iOS + Android) ── */
              <div style={{ padding: "16px 18px", background: "#fff7ed", borderRadius: 14, border: "2px solid #fed7aa", marginBottom: 18 }}>
                <div style={{ fontWeight: 800, fontSize: "0.82rem", color: "#9a3412", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Mobile Instructions
                </div>
                <ol style={{ margin: 0, paddingLeft: 20, color: "#374151", fontSize: "0.88rem", lineHeight: 1.8 }}>
                  <li>Tap <strong>Copy Code</strong> below</li>
                  <li>Go to <a href="https://dinners.onetable.org/profile" target="_blank" rel="noopener noreferrer" style={{ color: "#ea580c" }}>dinners.onetable.org/profile</a> and sign in if needed</li>
                  <li>Bookmark that page in your browser</li>
                  <li>Find the bookmark and <strong>edit</strong> it — delete the URL and <strong>paste</strong> the copied code — save it as <em>ViteMeals</em></li>
                  <li>While still on dinners.onetable.org, open that <strong>ViteMeals</strong> bookmark — you'll be redirected back automatically</li>
                </ol>
                <div style={{ marginTop: 10, padding: "10px 14px", background: "white", borderRadius: 10, border: "1px solid #fed7aa", fontSize: "0.82rem", color: "#9a3412" }}>
                  <strong>Safari (iPhone/iPad):</strong> Share icon → Add Bookmark → Bookmarks → Edit<br />
                  <strong>Chrome (Android):</strong> ⋮ menu → Bookmarks → star icon → long-press → Edit
                </div>
                <button onClick={copyBookmarklet} style={{ marginTop: 14, width: "100%", padding: "12px 0", borderRadius: 12, border: "none", background: copied ? "linear-gradient(135deg, #10b981 0%, #059669 100%)" : "linear-gradient(135deg, #f97316 0%, #ea580c 100%)", color: "white", fontWeight: 800, fontSize: "1rem", cursor: "pointer", transition: "background 0.2s" }}>
                  {copied ? "✓ Copied!" : "📋 Copy Code"}
                </button>
              </div>
            ) : (
              /* ── Desktop instructions ── */
              <div style={{ padding: "16px 18px", background: "#fff7ed", borderRadius: 14, border: "2px solid #fed7aa", marginBottom: 18 }}>
                <div style={{ fontWeight: 800, fontSize: "0.82rem", color: "#9a3412", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  How it works
                </div>
                <ol style={{ margin: 0, paddingLeft: 20, color: "#374151", fontSize: "0.88rem", lineHeight: 1.7 }}>
                  <li>Drag the orange button below to your <strong>bookmarks bar</strong></li>
                  <li>Go to <a href="https://dinners.onetable.org/profile" target="_blank" rel="noopener noreferrer" style={{ color: "#ea580c" }}>dinners.onetable.org/profile</a> and sign in if needed</li>
                  <li>Click the <strong>ViteMeals</strong> bookmark — an orange badge appears</li>
                  <li><strong>Scroll down</strong> on the page — you'll be redirected back automatically</li>
                </ol>
              </div>
            )}

            {!isMobile && (
              <>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}>
                  <a
                    ref={bookmarkAnchorRef}
                    onClick={(e) => e.preventDefault()}
                    draggable
                    style={{
                      display: "inline-block",
                      padding: "12px 24px",
                      borderRadius: 14,
                      background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                      color: "white",
                      fontWeight: 800,
                      fontSize: "1rem",
                      textDecoration: "none",
                      boxShadow: "0 6px 18px rgba(249,115,22,0.4)",
                      cursor: "grab",
                      userSelect: "none",
                      letterSpacing: "0.3px",
                    }}
                    title="Drag me to your bookmarks bar"
                  >
                    🔗 ViteMeals
                  </a>
                </div>
                <p style={{ textAlign: "center", color: "#9ca3af", fontSize: "0.78rem", margin: "4px 0 16px" }}>
                  ↑ drag to bookmarks bar
                </p>
              </>
            )}

            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <button onClick={onClose} style={cancelBtn}>Cancel</button>
            </div>

            <button
              onClick={() => setStep("manual")}
              style={{ marginTop: 14, background: "none", border: "none", color: "#9ca3af", fontSize: "0.82rem", cursor: "pointer", textDecoration: "underline", padding: 0 }}
            >
              Paste token manually instead
            </button>
          </>
        )}

        {/* ── Manual token step ── */}
        {step === "manual" && (
          <>
            <p style={subtitleStyle}>
              Paste your bearer token (from DevTools → Network → any graphql request → Authorization header).
            </p>

            <label style={labelStyle}>Bearer Token</label>
            <textarea
              value={manualToken}
              onChange={(e) => { setManualToken(e.target.value); setVerifyError(null); }}
              placeholder="eyJhbGci..."
              rows={4}
              style={{ ...inputStyle, fontFamily: "monospace", fontSize: "0.78rem", resize: "vertical" }}
            />

            {verifyError && <div style={errorStyle}>{verifyError}</div>}

            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button onClick={() => setStep("bookmarklet")} style={cancelBtn}>← Back</button>
              <button
                onClick={handleVerifyManual}
                disabled={!manualToken.trim() || verifying || saving}
                style={primaryBtnDynamic(!manualToken.trim() || verifying || saving)}
              >
                {verifying ? "Verifying…" : saving ? "Saving…" : "Verify & Save →"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const headingStyle: React.CSSProperties = {
  margin: "0 0 4px",
  fontWeight: 900,
  background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  fontSize: "1.5rem",
};

const subtitleStyle: React.CSSProperties = {
  margin: "6px 0 20px",
  color: "#6b7280",
  fontSize: "0.9rem",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontWeight: 700,
  fontSize: "0.82rem",
  color: "#374151",
  marginBottom: 4,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 10,
  border: "2px solid #e5e7eb",
  fontSize: "0.95rem",
  fontWeight: 500,
  fontFamily: "Inter, sans-serif",
  boxSizing: "border-box",
};

const errorStyle: React.CSSProperties = {
  color: "#ef4444",
  fontSize: "0.84rem",
  fontWeight: 600,
  marginTop: 8,
};

const cancelBtn: React.CSSProperties = {
  padding: "11px 18px",
  borderRadius: 12,
  border: "2px solid #e5e7eb",
  background: "white",
  color: "#6b7280",
  fontWeight: 700,
  fontSize: "0.9rem",
  cursor: "pointer",
};

function primaryBtnDynamic(disabled: boolean): React.CSSProperties {
  return {
    flex: 1,
    padding: "11px 20px",
    borderRadius: 12,
    border: "none",
    background: disabled
      ? "#d1d5db"
      : "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
    color: "white",
    fontWeight: 700,
    fontSize: "0.9rem",
    cursor: disabled ? "not-allowed" : "pointer",
    boxShadow: disabled ? "none" : "0 4px 12px rgba(249,115,22,0.3)",
  };
}
