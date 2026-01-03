const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now,
    },
    checkIn: {
      type: Date,
      required: false,
    },
    checkOut: {
      type: Date,
      required: false,
    },
    status: {
      type: String,
      enum: ["Present", "Absent", "Half Day", "Leave", "Holiday"],
      default: "Absent",
    },
    hoursWorked: {
      type: Number,
      default: 0,
    },
    location: {
      type: {
        type: String,
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        index: "2dsphere",
      },
    },
    deviceInfo: {
      type: String,
      trim: true,
    },
    remarks: {
      type: String,
      trim: true,
      maxlength: [200, "Remarks cannot exceed 200 characters"],
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
attendanceSchema.index({ user: 1, date: 1 }, { unique: true });
attendanceSchema.index({ date: 1 });
attendanceSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model("Attendance", attendanceSchema);
