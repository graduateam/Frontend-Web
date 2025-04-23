import React from "react";

const Input = ({
  type = "text",
  placeholder,
  value,
  onChange,
  className = "",
  variant = "default", // default, primary, error
}) => {
  let variantClass = "";

  switch (variant) {
    case "primary":
      variantClass = "border-traffic-orange";
      break;
    case "error":
      variantClass = "border-traffic-orange-d1";
      break;
    default:
      variantClass = "border-gray-20";
  }

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`${variantClass} ${className}`}
    />
  );
};

export default Input;
