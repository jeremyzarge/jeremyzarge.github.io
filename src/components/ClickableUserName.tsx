import { useState } from "react";

interface ClickableUserNameProps {
  userId: string;
  firstName: string;
  lastName: string;
  onClick: (userId: string) => void;
  style?: React.CSSProperties;
}

/**
 * Reusable clickable user name that looks like inline text
 */
export default function ClickableUserName({
  userId,
  firstName,
  lastName,
  onClick,
  style,
}: ClickableUserNameProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={() => onClick(userId)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "none",
        border: "none",
        padding: 0,
        margin: 0,
        font: "inherit",
        color: "#4f46e5",
        fontWeight: 700,
        cursor: "pointer",
        textDecoration: hovered ? "underline" : "none",
        ...style,
      }}
    >
      {firstName} {lastName}
    </button>
  );
}
