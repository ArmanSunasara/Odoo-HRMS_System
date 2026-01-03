const Attendance = require("../models/Attendance");
const User = require("../models/User");

// @desc    Mark attendance
// @route   POST /api/attendance/mark
// @access  Private
const markAttendance = async (req, res, next) => {
  try {
    const {
      date,
      checkIn,
      checkOut,
      status,
      hoursWorked,
      location,
      deviceInfo,
      remarks,
    } = req.body;
    const userId = req.user.id;

    // Check if attendance already exists for the date
    let attendance = await Attendance.findOne({
      user: userId,
      date: new Date(date),
    });

    if (attendance) {
      // Update existing attendance record
      attendance = await Attendance.findOneAndUpdate(
        { user: userId, date: new Date(date) },
        {
          checkIn,
          checkOut,
          status,
          hoursWorked,
          location,
          deviceInfo,
          remarks,
        },
        { new: true, runValidators: true }
      );
    } else {
      // Create new attendance record
      attendance = await Attendance.create({
        user: userId,
        date: new Date(date),
        checkIn,
        checkOut,
        status,
        hoursWorked,
        location,
        deviceInfo,
        remarks,
      });
    }

    res.status(200).json({
      success: true,
      message: "Attendance marked successfully",
      data: attendance,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get attendance records for a user
// @route   GET /api/attendance
// @access  Private
const getAttendanceRecords = async (req, res, next) => {
  try {
    const { userId, startDate, endDate, page = 1, limit = 10 } = req.query;
    const currentUserId = req.user.id;
    const userRole = req.user.role;

    // Only allow users to view their own attendance unless they are admin/manager
    let queryUserId = currentUserId;
    if (userRole === "admin" || userRole === "manager") {
      queryUserId = userId || currentUserId;
    }

    // Build filter object
    const filter = { user: queryUserId };
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const attendanceRecords = await Attendance.find(filter)
      .populate("user", "name email")
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Attendance.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: attendanceRecords.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: attendanceRecords,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get attendance record by ID
// @route   GET /api/attendance/:id
// @access  Private
const getAttendanceById = async (req, res, next) => {
  try {
    const attendance = await Attendance.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found",
      });
    }

    // Check if user can access this record
    if (
      req.user.role !== "admin" &&
      req.user.role !== "manager" &&
      attendance.user._id.toString() !== req.user.id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.status(200).json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get monthly attendance report
// @route   GET /api/attendance/monthly-report
// @access  Private
const getMonthlyReport = async (req, res, next) => {
  try {
    const { userId, month, year } = req.query;
    const currentUserId = req.user.id;
    const userRole = req.user.role;

    // Only allow users to view their own report unless they are admin/manager
    const queryUserId =
      userRole === "admin" || userRole === "manager"
        ? userId || currentUserId
        : currentUserId;

    // Validate month and year
    if (!month || !year) {
      return res.status(400).json({
        success: false,
        message: "Month and year are required",
      });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const attendanceRecords = await Attendance.find({
      user: queryUserId,
      date: { $gte: startDate, $lte: endDate },
    }).populate("user", "name email");

    // Calculate statistics
    let totalDays = 0;
    let presentDays = 0;
    let absentDays = 0;
    let leaveDays = 0;
    let halfDays = 0;
    let totalHours = 0;

    attendanceRecords.forEach((record) => {
      totalDays++;
      totalHours += record.hoursWorked || 0;

      switch (record.status) {
        case "Present":
          presentDays++;
          break;
        case "Absent":
          absentDays++;
          break;
        case "Leave":
          leaveDays++;
          break;
        case "Half Day":
          halfDays++;
          break;
      }
    });

    const monthlyReport = {
      month: `${year}-${String(month).padStart(2, "0")}`,
      user: attendanceRecords[0]?.user || null,
      totalDays,
      presentDays,
      absentDays,
      leaveDays,
      halfDays,
      totalHours,
      records: attendanceRecords,
    };

    res.status(200).json({
      success: true,
      data: monthlyReport,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update attendance record
// @route   PUT /api/attendance/:id
// @access  Private/Admin
const updateAttendance = async (req, res, next) => {
  try {
    const allowedFields = [
      "checkIn",
      "checkOut",
      "status",
      "hoursWorked",
      "location",
      "deviceInfo",
      "remarks",
    ];
    const updateData = {};

    // Only allow specific fields to be updated
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).populate("user", "name email");

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Attendance record updated successfully",
      data: attendance,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete attendance record
// @route   DELETE /api/attendance/:id
// @access  Private/Admin
const deleteAttendance = async (req, res, next) => {
  try {
    const attendance = await Attendance.findByIdAndDelete(req.params.id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Attendance record deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  markAttendance,
  getAttendanceRecords,
  getAttendanceById,
  getMonthlyReport,
  updateAttendance,
  deleteAttendance,
};
