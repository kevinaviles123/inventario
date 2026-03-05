import React, { forwardRef } from "react";

const Input = forwardRef(
  (
    {
      label,
      type = "text",
      name,
      placeholder,
      icon,
      error,
      className = "",
      ...rest
    },
    ref
  ) => {
    return (
      <div className="space-y-1">
        {label && (
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor={name}
          >
            {label}
          </label>
        )}
        <div className="relative rounded-md shadow-sm">
          {icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              {icon}
            </div>
          )}
          <input
            id={name}
            name={name}
            type={type}
            ref={ref}
            placeholder={placeholder}
            className={`
              block w-full rounded-md border border-gray-300 px-3 py-2 text-sm
              focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500
              ${icon ? "pl-10" : ""}
              ${error ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}
              ${className}
            `}
            {...rest}
          />
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;

