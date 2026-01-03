import React from "react";

/**
 * Reusable Button Component
 * @param {string} variant - Button style variant (primary, secondary, danger, outline)
 * @param {string} size - Button size (sm, md, lg)
 * @param {boolean} disabled - Disable button
 * @param {boolean} loading - Show loading state
 * @param {string} type - Button type (button, submit, reset)
 * @param {function} onClick - Click handler
 * @param {ReactNode} children - Button content
 */
function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  type = "button",
  onClick,
  children,
  className = "",
  ...props
}) {
  const baseClasses = "btn";
  const variantClasses = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    danger: "btn-danger",
    outline: "btn-outline",
  };
  const sizeClasses = {
    sm: "btn-sm",
    md: "btn-md",
    lg: "btn-lg",
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim();

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <>
          <span className="spinner"></span>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
}

export default Button;

