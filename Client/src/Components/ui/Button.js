import React from "react";

const variants = {
  primary: "bg-indigo-600 text-white hover:bg-indigo-700",
  outline: "border border-indigo-600 text-indigo-600 hover:bg-indigo-50",
};

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}) {
  return (
    <button
      className={`px-4 py-2 rounded ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
