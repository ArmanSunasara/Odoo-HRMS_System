const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    leaveType: {
      type: String,
      required: [true, "Leave type is required"],
      enum: ["Paid", "Sick", "Unpaid"],
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    reason: {
      type: String,
      required: [true, "Reason is required"],
      trim: true,
      maxlength: [500, "Reason cannot exceed 500 characters"],
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    adminComment: {
      type: String,
      trim: true,
      maxlength: [500, "Admin comment cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
leaveSchema.index({ employee: 1, startDate: 1 });
leaveSchema.index({ status: 1 });
leaveSchema.index({ employee: 1, status: 1 });

module.exports = mongoose.model("Leave", leaveSchema);
