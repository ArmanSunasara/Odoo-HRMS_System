const User = require("../models/User");
const Attendance = require("../models/Attendance");
const Leave = require("../models/Leave");
const Payroll = require("../models/Payroll");

// @desc    Get Employee Dashboard
// @route   GET /api/dashboard/employee
// @access  Private/Employee
const getEmployeeDashboard = async (req, res, next) => {
  try {
    const employeeId = req.user.id;

    // Get profile summary
    const user = await User.findById(employeeId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get attendance summary (current month)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    const attendanceRecords = await Attendance.find({
      employee: employeeId,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const attendanceSummary = {
      totalDays: attendanceRecords.length,
      present: attendanceRecords.filter((a) => a.status === "Present").length,
      absent: attendanceRecords.filter((a) => a.status === "Absent").length,
      halfDay: attendanceRecords.filter((a) => a.status === "Half-day").length,
      leave: attendanceRecords.filter((a) => a.status === "Leave").length,
    };

    // Get leave status summary
    const leaveRequests = await Leave.find({ employee: employeeId }).sort({
      createdAt: -1,
    });

    const leaveSummary = {
      pending: leaveRequests.filter((l) => l.status === "Pending").length,
      approved: leaveRequests.filter((l) => l.status === "Approved").length,
      rejected: leaveRequests.filter((l) => l.status === "Rejected").length,
      recentRequests: leaveRequests.slice(0, 5),
    };

    res.status(200).json({
      success: true,
      message: "Employee dashboard retrieved successfully",
      data: {
        profile: {
          employeeId: user.employeeId,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          address: user.address,
          jobDetails: user.jobDetails,
        },
        attendanceSummary,
        leaveSummary,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Admin Dashboard
// @route   GET /api/dashboard/admin
// @access  Private/Admin
const getAdminDashboard = async (req, res, next) => {
  try {
    // Get employee list
    const employees = await User.find({ role: "EMPLOYEE" })
      .select("employeeId name email phone jobDetails")
      .sort({ createdAt: -1 });

    // Get pending leave requests
    const pendingLeaves = await Leave.find({ status: "Pending" })
      .populate("employee", "employeeId name email")
      .sort({ createdAt: -1 })
      .limit(10);

    // Get attendance overview (current month)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    const attendanceRecords = await Attendance.find({
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const attendanceOverview = {
      totalRecords: attendanceRecords.length,
      present: attendanceRecords.filter((a) => a.status === "Present").length,
      absent: attendanceRecords.filter((a) => a.status === "Absent").length,
      halfDay: attendanceRecords.filter((a) => a.status === "Half-day").length,
      leave: attendanceRecords.filter((a) => a.status === "Leave").length,
    };

    res.status(200).json({
      success: true,
      message: "Admin dashboard retrieved successfully",
      data: {
        employees: {
          total: employees.length,
          list: employees,
        },
        pendingLeaveRequests: {
          total: pendingLeaves.length,
          requests: pendingLeaves,
        },
        attendanceOverview,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEmployeeDashboard,
  getAdminDashboard,
};

