
interface FloatingAddButtonProps {
  onClick: () => void;
}

/**
 * Floating action button for creating new meals with hover tooltip
 */
export default function FloatingAddButton({ onClick }: FloatingAddButtonProps) {
  return (
    <button
      className="fab"
      onClick={onClick}
      style={{
        position: "fixed",
        bottom: 40,
        right: 40,
        width: "auto",
        height: 64,
        borderRadius: 50,
        border: "none",
        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        color: "white",
        fontSize: "1.1rem",
        fontWeight: 700,
        lineHeight: "1",
        cursor: "pointer",
        boxShadow: "0 8px 24px rgba(16, 185, 129, 0.4)",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        whiteSpace: "nowrap",
      }}
      title="Create a new meal"
    >
      <span style={{ fontSize: "1.5rem" }}>+</span>
      <span className="fab-label">Create Meal</span>
    </button>
  );
}
