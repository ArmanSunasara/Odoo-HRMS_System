const { body, validationResult, query, param } = require("express-validator");

// Validation rules for user registration (Sign Up)
const registerValidationRules = () => {
  return [
    body("employeeId")
      .trim()
      .notEmpty()
      .withMessage("Employee ID is required")
      .isLength({ min: 2, max: 20 })
      .withMessage("Employee ID must be between 2 and 20 characters"),
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ max: 50 })
      .withMessage("Name cannot exceed 50 characters"),
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage(
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    body("role")
      .optional()
      .isIn(["EMPLOYEE", "ADMIN"])
      .withMessage("Role must be either EMPLOYEE or ADMIN"),
  ];
};

// Validation rules for user login
const loginValidationRules = () => {
  return [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email"),
    body("password").exists().withMessage("Password is required"),
  ];
};

// Validation rules for leave application
const applyLeaveValidationRules = () => {
  return [
    body("leaveType")
      .isIn(["Paid", "Sick", "Unpaid"])
      .withMessage("Invalid leave type. Must be Paid, Sick, or Unpaid"),
    body("startDate")
      .isISO8601()
      .withMessage("Start date must be a valid date"),
    body("endDate")
      .isISO8601()
      .withMessage("End date must be a valid date")
      .custom((endDate, { req }) => {
        if (new Date(endDate) < new Date(req.body.startDate)) {
          throw new Error("End date must be after start date");
        }
        return true;
      }),
    body("reason")
      .trim()
      .isLength({ max: 500 })
      .withMessage("Reason cannot exceed 500 characters")
      .notEmpty()
      .withMessage("Reason is required"),
  ];
};

// Validation rules for updating leave status
const updateLeaveStatusValidationRules = () => {
  return [
    body("status")
      .isIn(["Pending", "Approved", "Rejected"])
      .withMessage("Invalid status. Must be Pending, Approved, or Rejected"),
    body("adminComment")
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage("Admin comment cannot exceed 500 characters"),
  ];
};

// Validation rules for payroll
const createPayrollValidationRules = () => {
  return [
    body("employeeId")
      .trim()
      .notEmpty()
      .withMessage("Employee ID is required"),
    body("month")
      .trim()
      .notEmpty()
      .withMessage("Month is required"),
    body("basicSalary")
      .isFloat({ min: 0 })
      .withMessage("Basic salary must be a positive number"),
    body("allowances")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Allowances must be a positive number"),
    body("deductions")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Deductions must be a positive number"),
  ];
};


// Helper function to run validations
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};

module.exports = {
  registerValidationRules,
  loginValidationRules,
  applyLeaveValidationRules,
  updateLeaveStatusValidationRules,
  createPayrollValidationRules,
  validate,
  validationResult,
};
