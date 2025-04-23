import React from "react";

const Button = ({
  children,
  onClick,
  className = "",
  variant = "primary", // primary, secondary, tertiary
  size = "medium", // small, medium, large
}) => {
  // 버튼 색상 변형에 따른 클래스 설정
  let colorClass = "";

  switch (variant) {
    case "primary":
      colorClass = "bg-traffic-orange text-white";
      break;
    case "secondary":
      colorClass = "bg-traffic-orange-b1 text-white";
      break;
    case "tertiary":
      colorClass = "bg-white text-traffic-orange border-traffic-orange";
      break;
    default:
      colorClass = "bg-traffic-orange text-white";
  }

  // 버튼 크기에 따른 클래스 설정
  let sizeClass = "";

  switch (size) {
    case "small":
      sizeClass = "py-1 px-3";
      break;
    case "medium":
      sizeClass = "py-2 px-4";
      break;
    case "large":
      sizeClass = "py-3 px-6";
      break;
    default:
      sizeClass = "py-2 px-4";
  }

  return (
    <button
      className={`${colorClass} ${sizeClass} rounded ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
