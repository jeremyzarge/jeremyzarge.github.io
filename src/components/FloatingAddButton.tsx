import { useState } from "react";

interface FloatingAddButtonProps {
  onClick: () => void;
}

/**
 * Floating action button for creating new meals with hover tooltip
 */
export default function FloatingAddButton({ onClick }: FloatingAddButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: "fixed",
        bottom: 40,
        right: 40,
        width: isHovered ? "auto" : 64,
        height: 64,
        borderRadius: 50,
        border: "none",
        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        color: "white",
        fontSize: isHovered ? "1.1rem" : "2rem",
        fontWeight: 700,
        lineHeight: "1",
        cursor: "pointer",
        boxShadow: "0 8px 24px rgba(16, 185, 129, 0.4)",
        padding: isHovered ? "0 24px" : 0,
        transition: "all 0.3s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        whiteSpace: "nowrap",
      }}
      title="Create a new meal"
    >
      {isHovered ? (
        <>
          <span style={{ fontSize: "1.5rem" }}>+</span>
          <span>Create Meal</span>
        </>
      ) : (
        "+"
      )}
    </button>
  );
}
