interface DataSecurityModalProps {
  onClose: () => void;
}

export default function DataSecurityModal({ onClose }: DataSecurityModalProps) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1100,
        backdropFilter: "blur(4px)",
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "white",
          borderRadius: 20,
          padding: 24,
          width: "100%",
          maxWidth: 460,
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          border: "4px solid transparent",
          backgroundImage:
            "linear-gradient(white, white), linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          style={{
            margin: "0 0 6px",
            fontWeight: 900,
            fontSize: "1.4rem",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Data & Security
        </h3>
        <p style={{ margin: "0 0 18px", color: "#6b7280", fontSize: "0.9rem" }}>
          A plain-language summary of what's stored and how it's protected.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 14, fontSize: "0.88rem", color: "#374151", lineHeight: 1.5 }}>
          <div>
            <div style={{ fontWeight: 800, marginBottom: 3 }}>What's stored</div>
            Your name, apartment, food preferences/allergies, and meal activity are visible to other
            signed-in members of the app, since that's needed for meal planning. Your email address
            and OneTable connection are not — those are readable only by you.
          </div>
          <div>
            <div style={{ fontWeight: 800, marginBottom: 3 }}>How access is controlled</div>
            Everything requires signing in with a Google account. Server-side rules — not just app
            code — enforce who can read or write each piece of data, and your OneTable connection is
            never exposed to anyone else's browser.
          </div>
          <div>
            <div style={{ fontWeight: 800, marginBottom: 3 }}>OneTable actions on your behalf</div>
            When a host or guest action needs to touch someone else's OneTable connection (like
            auto-accepting your RSVP), that's done by a small server-side service that verifies your
            identity and that you're actually authorized for that specific meal — it never hands your
            connection token to another person's device.
          </div>
          <div>
            <div style={{ fontWeight: 800, marginBottom: 3 }}>What this doesn't include</div>
            Data isn't end-to-end encrypted — protection comes from access-control rules and requiring
            sign-in, not from encrypting the data itself. This is a small app built for friends, not a
            commercial product with a formal security audit.
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 22 }}>
          <button
            onClick={onClose}
            style={{
              padding: "10px 24px",
              borderRadius: 10,
              border: "none",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: "0.95rem",
            }}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
