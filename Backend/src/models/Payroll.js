const mongoose = require("mongoose");

const payrollSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    period: {
      type: String, // Format: "MM/YYYY" or "Month Year"
      required: [true, "Payroll period is required"],
      trim: true,
    },
    basicSalary: {
      type: Number,
      required: [true, "Basic salary is required"],
      min: [0, "Salary cannot be negative"],
    },
    allowances: {
      type: Number,
      default: 0,
    },
    bonuses: {
      type: Number,
      default: 0,
    },
    deductions: {
      type: Number,
      default: 0,
    },
    netSalary: {
      type: Number,
      required: [true, "Net salary is required"],
    },
    tax: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Processing", "Paid", "Failed"],
      default: "Processing",
    },
    paymentDate: {
      type: Date,
    },
    paymentMethod: {
      type: String,
      enum: ["Bank Transfer", "Cash", "Check"],
      default: "Bank Transfer",
    },
    bankDetails: {
      accountNumber: String,
      bankName: String,
      ifscCode: String,
    },
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
    remarks: {
      type: String,
      trim: true,
      maxlength: [500, "Remarks cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
payrollSchema.index({ user: 1, period: 1 }, { unique: true });
payrollSchema.index({ status: 1 });
payrollSchema.index({ user: 1, paymentDate: -1 });

module.exports = mongoose.model("Payroll", payrollSchema);
