const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    leaveType: {
      type: String,
      required: [true, "Leave type is required"],
      enum: [
        "Casual",
        "Vacation",
        "Sick",
        "Personal",
        "Maternity",
        "Paternity",
        "Unpaid",
      ],
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
      enum: ["Pending", "Approved", "Rejected", "Cancelled"],
      default: "Pending",
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    approvedDate: {
      type: Date,
    },
    managerNote: {
      type: String,
      trim: true,
      maxlength: [500, "Manager note cannot exceed 500 characters"],
    },
    documents: [
      {
        type: String, // URLs to supporting documents
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
leaveSchema.index({ user: 1, startDate: 1 });
leaveSchema.index({ status: 1 });
leaveSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model("Leave", leaveSchema);
