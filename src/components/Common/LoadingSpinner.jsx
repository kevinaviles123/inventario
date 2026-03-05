import React from "react";

const LoadingSpinner = ({ fullScreen = false, size = "md", color = "primary" }) => {
  const sizes = {
    sm: "h-6 w-6",
    md: "h-12 w-12",
    lg: "h-16 w-16",
    xl: "h-24 w-24",
  };

  const colors = {
    primary: "border-primary-600",
    white: "border-white",
    gray: "border-gray-600",
  };

  const spinner = (
    <div className="flex justify-center items-center">
      <div
        className={`
          animate-spin rounded-full border-b-2 
          ${sizes[size]} 
          ${colors[color]}
        `}
      />
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;