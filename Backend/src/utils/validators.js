const { body, validationResult, query, param } = require("express-validator");

// Validation rules for user registration
const registerValidationRules = () => {
  return [
    body("name")
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("Name must be between 2 and 50 characters")
      .matches(/^[a-zA-Z\s]+$/)
      .withMessage("Name can only contain letters and spaces"),
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
    body("position")
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage("Position cannot exceed 50 characters"),
    body("department")
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage("Department cannot exceed 50 characters"),
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
      .isIn([
        "Casual",
        "Vacation",
        "Sick",
        "Personal",
        "Maternity",
        "Paternity",
        "Unpaid",
      ])
      .withMessage("Invalid leave type"),
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
    body("documents")
      .optional()
      .isArray()
      .withMessage("Documents must be an array"),
  ];
};

// Validation rules for updating leave status
const updateLeaveStatusValidationRules = () => {
  return [
    body("status")
      .isIn(["Pending", "Approved", "Rejected", "Cancelled"])
      .withMessage("Invalid status"),
    body("managerNote")
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage("Manager note cannot exceed 500 characters"),
  ];
};

// Validation rules for marking attendance
const markAttendanceValidationRules = () => {
  return [
    body("date")
      .optional()
      .isISO8601()
      .withMessage("Date must be a valid date"),
    body("checkIn")
      .optional()
      .isISO8601()
      .withMessage("Check-in time must be a valid date"),
    body("checkOut")
      .optional()
      .isISO8601()
      .withMessage("Check-out time must be a valid date"),
    body("status")
      .optional()
      .isIn(["Present", "Absent", "Half Day", "Leave", "Holiday"])
      .withMessage("Invalid attendance status"),
    body("hoursWorked")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Hours worked must be a positive number"),
  ];
};

// Validation rules for generating payroll
const generatePayrollValidationRules = () => {
  return [
    body("userId").isMongoId().withMessage("Valid user ID is required"),
    body("period").trim().notEmpty().withMessage("Payroll period is required"),
    body("basicSalary")
      .isFloat({ min: 0 })
      .withMessage("Basic salary must be a positive number"),
    body("allowances")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Allowances must be a positive number"),
    body("bonuses")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Bonuses must be a positive number"),
    body("deductions")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Deductions must be a positive number"),
    body("tax")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Tax must be a positive number"),
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
  markAttendanceValidationRules,
  generatePayrollValidationRules,
  validate,
  validationResult,
};
