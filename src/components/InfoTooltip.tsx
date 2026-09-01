import { useEffect, useRef, useState } from "react";

interface InfoItem {
  icon: string;
  iconBg: string;
  text: string;
}

interface InfoTooltipProps {
  title: string;
  items: InfoItem[];
}

/**
 * Small "i" info button that reveals a click-to-open explainer panel.
 * Used in place of native `title` tooltips, which are slow to appear and
 * don't work at all on touch devices.
 */
export default function InfoTooltip({ title, items }: InfoTooltipProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-flex" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={title}
        style={{
          width: 22,
          height: 22,
          borderRadius: "50%",
          border: "none",
          background: open ? "#9ca3af" : "#e5e7eb",
          color: open ? "white" : "#6b7280",
          fontWeight: 800,
          fontSize: "0.75rem",
          fontStyle: "italic",
          fontFamily: "Georgia, 'Times New Roman', serif",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        i
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            width: "max-content",
            maxWidth: 220,
            background: "white",
            borderRadius: 10,
            padding: "12px 14px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            border: "2px solid #e5e7eb",
            zIndex: 400,
          }}
        >
          <div
            style={{
              fontWeight: 800,
              fontSize: "0.85rem",
              color: "#374151",
              fontFamily: "Inter, sans-serif",
              marginBottom: 8,
              whiteSpace: "nowrap",
            }}
          >
            {title}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {items.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    width: 19,
                    height: 19,
                    borderRadius: "50%",
                    background: item.iconBg,
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: "0.75rem",
                    lineHeight: 1,
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </span>
                <span
                  style={{
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    color: "#374151",
                    lineHeight: 1.35,
                    fontFamily: "Inter, sans-serif",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
