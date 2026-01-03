const Attendance = require("../models/Attendance");
const User = require("../models/User");

// @desc    Check-in
// @route   POST /api/attendance/checkin
// @access  Private/Employee
const checkIn = async (req, res, next) => {
  try {
    const employeeId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already checked in today
    const existingAttendance = await Attendance.findOne({
      employee: employeeId,
      date: today,
    });

    if (existingAttendance && existingAttendance.checkInTime) {
      return res.status(400).json({
        success: false,
        message: "Already checked in today",
      });
    }

    let attendance;
    if (existingAttendance) {
      attendance = await Attendance.findByIdAndUpdate(
        existingAttendance._id,
        {
          checkInTime: new Date(),
          status: "Present",
        },
        { new: true }
      );
    } else {
      attendance = await Attendance.create({
        employee: employeeId,
        date: today,
        checkInTime: new Date(),
        status: "Present",
      });
    }

    res.status(200).json({
      success: true,
      message: "Checked in successfully",
      data: attendance,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check-out
// @route   POST /api/attendance/checkout
// @access  Private/Employee
const checkOut = async (req, res, next) => {
  try {
    const employeeId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      employee: employeeId,
      date: today,
    });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "No check-in found for today",
      });
    }

    if (attendance.checkOutTime) {
      return res.status(400).json({
        success: false,
        message: "Already checked out today",
      });
    }

    attendance.checkOutTime = new Date();
    await attendance.save();

    res.status(200).json({
      success: true,
      message: "Checked out successfully",
      data: attendance,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get attendance records
// @route   GET /api/attendance
// @access  Private
const getAttendance = async (req, res, next) => {
  try {
    const { startDate, endDate, page = 1, limit = 10 } = req.query;
    const employeeId = req.user.id;
    const userRole = req.user.role;

    // Build filter
    let filter = {};
    
    // Employee can only view their own attendance
    if (userRole === "EMPLOYEE") {
      filter.employee = employeeId;
    } else if (userRole === "ADMIN") {
      // Admin can view all or filter by employeeId if provided
      if (req.query.employeeId) {
        const employee = await User.findOne({ employeeId: req.query.employeeId });
        if (employee) {
          filter.employee = employee._id;
        } else {
          return res.status(404).json({
            success: false,
            message: "Employee not found",
          });
        }
      }
    }

    // Date range filter
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        filter.date.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.date.$lte = end;
      }
    }

    const attendanceRecords = await Attendance.find(filter)
      .populate("employee", "employeeId name email")
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Attendance.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: "Attendance records retrieved successfully",
      data: {
        records: attendanceRecords,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get weekly attendance
// @route   GET /api/attendance/weekly
// @access  Private
const getWeeklyAttendance = async (req, res, next) => {
  try {
    const { weekStart } = req.query;
    const employeeId = req.user.id;
    const userRole = req.user.role;

    // Calculate week start and end
    let startDate;
    if (weekStart) {
      startDate = new Date(weekStart);
    } else {
      startDate = new Date();
      const day = startDate.getDay();
      const diff = startDate.getDate() - day;
      startDate = new Date(startDate.setDate(diff));
    }
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    endDate.setHours(23, 59, 59, 999);

    let filter = {
      date: { $gte: startDate, $lte: endDate },
    };

    if (userRole === "EMPLOYEE") {
      filter.employee = employeeId;
    } else if (userRole === "ADMIN" && req.query.employeeId) {
      const employee = await User.findOne({ employeeId: req.query.employeeId });
      if (employee) {
        filter.employee = employee._id;
      } else {
        return res.status(404).json({
          success: false,
          message: "Employee not found",
        });
      }
    }

    const attendanceRecords = await Attendance.find(filter)
      .populate("employee", "employeeId name email")
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      message: "Weekly attendance retrieved successfully",
      data: {
        weekStart: startDate,
        weekEnd: endDate,
        records: attendanceRecords,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkIn,
  checkOut,
  getAttendance,
  getWeeklyAttendance,
};
