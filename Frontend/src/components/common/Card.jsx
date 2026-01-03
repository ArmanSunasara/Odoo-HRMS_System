import React from "react";

/**
 * Reusable Card Component
 * @param {string} title - Card title
 * @param {ReactNode} children - Card content
 * @param {ReactNode} actions - Action buttons/elements
 * @param {string} className - Additional CSS classes
 */
function Card({ title, children, actions, className = "", ...props }) {
  return (
    <div className={`card ${className}`} {...props}>
      {title && (
        <div className="card-header">
          <h3 className="card-title">{title}</h3>
          {actions && <div className="card-actions">{actions}</div>}
        </div>
      )}
      <div className="card-body">{children}</div>
    </div>
  );
}

export default Card;

