const mongoose = require("mongoose");

const payrollSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    month: {
      type: String,
      required: [true, "Month is required"],
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
      min: [0, "Allowances cannot be negative"],
    },
    deductions: {
      type: Number,
      default: 0,
      min: [0, "Deductions cannot be negative"],
    },
    netSalary: {
      type: Number,
      required: [true, "Net salary is required"],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
payrollSchema.index({ employee: 1, month: 1 }, { unique: true });
payrollSchema.index({ employee: 1, month: -1 });

module.exports = mongoose.model("Payroll", payrollSchema);
