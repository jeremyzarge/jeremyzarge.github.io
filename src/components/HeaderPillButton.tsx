import type { ReactNode } from "react";

const PILL_WIDTH = 190;

interface HeaderPillButtonProps {
  onClick: () => void;
  variant?: "primary" | "secondary";
  children: ReactNode;
}

/**
 * One shared style for every pill in the desktop welcome header (Edit Profile,
 * Notifications, Data & Security, Admin, Sign Out), so they can't drift out of
 * sync from copy-pasted inline styles. Uses the `flex` shorthand rather than
 * separate width/minWidth/flexShrink — flex-basis takes priority over a plain
 * `width` in the flex sizing algorithm, so this is the reliable way to pin a
 * flex item's size regardless of its content.
 */
export default function HeaderPillButton({ onClick, variant = "secondary", children }: HeaderPillButtonProps) {
  const isPrimary = variant === "primary";
  return (
    <button
      onClick={onClick}
      style={{
        flex: `0 0 ${PILL_WIDTH}px`,
        boxSizing: "border-box",
        padding: "12px 20px",
        textAlign: "center",
        borderRadius: 50,
        border: "none",
        background: isPrimary ? "white" : "rgba(255,255,255,0.2)",
        color: isPrimary ? "#4f46e5" : "white",
        fontWeight: 700,
        fontFamily: "Inter, sans-serif",
        cursor: "pointer",
        fontSize: "1rem",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        backdropFilter: isPrimary ? undefined : "blur(8px)",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      {children}
    </button>
  );
}
