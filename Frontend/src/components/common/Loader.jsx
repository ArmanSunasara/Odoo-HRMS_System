import React from "react";

/**
 * Loader Component
 * @param {string} message - Loading message
 * @param {string} size - Loader size (sm, md, lg)
 */
function Loader({ message = "Loading...", size = "md" }) {
  return (
    <div className={`loader-container loader-${size}`}>
      <div className="loader-spinner"></div>
      {message && <p className="loader-message">{message}</p>}
    </div>
  );
}

export default Loader;
