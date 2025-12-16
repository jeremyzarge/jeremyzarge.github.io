export default function FloatingAddButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: "50%",
        border: "none",
        background: "#10b981",
        color: "white",
        fontSize: 32,
        lineHeight: "0",
        cursor: "pointer",
        boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
      }}
    >
      +
    </button>
  );
}
