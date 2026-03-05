import React from "react";

const baseStyles =
  "inline-flex items-center justify-center rounded-md border border-transparent text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors";

const variants = {
  primary:
    "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500",
  secondary:
    "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 focus:ring-primary-500",
  danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
};

const sizes = {
  sm: "px-3 py-1.5",
  md: "px-4 py-2",
  lg: "px-4 py-2.5",
};

const Button = ({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  disabled,
  className = "",
  ...rest
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={`${
        fullWidth ? "w-full" : ""
      } ${baseStyles} ${variants[variant]} ${sizes[size]} ${
        isDisabled ? "opacity-70 cursor-not-allowed" : ""
      } ${className}`}
      {...rest}
    >
      {loading ? "Cargando..." : children}
    </button>
  );
};

export default Button;

