import React, { SVGProps } from "react";

interface ChevronProps extends SVGProps<SVGSVGElement> {
  type?: "right" | "left" | "up" | "down";
}

export const Chevron: React.FC<ChevronProps> = ({
  type = "right",
  stroke = "white",
}) => {
  const getRotation = () => {
    switch (type) {
      case "left":
        return "rotate(-180deg)";
      case "up":
        return "rotate(-90deg)";
      case "down":
        return "rotate(90deg)";
      default:
        return "rotate(0deg)";
    }
  };

  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: getRotation() }}
    >
      <path
        d="M6.75 13.5L11.25 9L6.75 4.5"
        stroke={stroke}
        strokeOpacity="0.6"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
