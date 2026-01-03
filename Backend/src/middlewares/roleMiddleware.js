// Role-based access control middleware
const roleAuth = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Access denied. User not authenticated.",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. User role '${req.user.role}' does not have permission to access this resource.`,
      });
    }

    next();
  };
};

// Specific role middleware functions
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Access denied. User not authenticated.",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin access required.",
    });
  }

  next();
};

const isManager = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Access denied. User not authenticated.",
    });
  }

  if (req.user.role !== "manager" && req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Manager or admin access required.",
    });
  }

  next();
};

const isEmployee = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Access denied. User not authenticated.",
    });
  }

  if (
    req.user.role !== "employee" &&
    req.user.role !== "manager" &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Employee access required.",
    });
  }

  next();
};

module.exports = {
  roleAuth,
  isAdmin,
  isManager,
  isEmployee,
};
