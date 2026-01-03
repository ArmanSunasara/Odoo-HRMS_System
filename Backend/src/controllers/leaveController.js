const Leave = require("../models/Leave");
const User = require("../models/User");

// @desc    Apply for leave
// @route   POST /api/leave/request
// @access  Private
const applyLeave = async (req, res, next) => {
  try {
    const { leaveType, startDate, endDate, reason, documents } = req.body;
    const userId = req.user.id;

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      return res.status(400).json({
        success: false,
        message: "End date must be after start date",
      });
    }

    // Check for overlapping leave requests
    const overlappingLeave = await Leave.findOne({
      user: userId,
      $or: [
        { startDate: { $gte: start, $lte: end } },
        { endDate: { $gte: start, $lte: end } },
        { $and: [{ startDate: { $lte: start } }, { endDate: { $gte: end } }] },
      ],
      status: { $in: ["Pending", "Approved"] },
    });

    if (overlappingLeave) {
      return res.status(400).json({
        success: false,
        message: "You have an overlapping leave request",
      });
    }

    const leave = await Leave.create({
      user: userId,
      leaveType,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason,
      documents: documents || [],
    });

    res.status(201).json({
      success: true,
      message: "Leave request submitted successfully",
      data: leave,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get leave requests for a user
// @route   GET /api/leave/requests
// @access  Private
const getLeaveRequests = async (req, res, next) => {
  try {
    const {
      userId,
      status,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = req.query;
    const currentUserId = req.user.id;
    const userRole = req.user.role;

    // Only allow users to view their own requests unless they are admin/manager
    let queryUserId = currentUserId;
    if (userRole === "admin" || userRole === "manager") {
      queryUserId = userId || currentUserId;
    }

    // Build filter object
    const filter = { user: queryUserId };
    if (status) filter.status = status;
    if (startDate || endDate) {
      filter.startDate = {};
      if (startDate) filter.startDate.$gte = new Date(startDate);
      if (endDate) filter.startDate.$lte = new Date(endDate);
    }

    const leaveRequests = await Leave.find(filter)
      .populate("user", "name email")
      .populate("approvedBy", "name email")
      .sort({ appliedDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Leave.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: leaveRequests.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: leaveRequests,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get leave request by ID
// @route   GET /api/leave/request/:id
// @access  Private
const getLeaveRequest = async (req, res, next) => {
  try {
    const leave = await Leave.findById(req.params.id)
      .populate("user", "name email")
      .populate("approvedBy", "name email");

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave request not found",
      });
    }

    // Check if user can access this record
    if (
      req.user.role !== "admin" &&
      req.user.role !== "manager" &&
      leave.user._id.toString() !== req.user.id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.status(200).json({
      success: true,
      data: leave,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update leave request status
// @route   PUT /api/leave/request/:id/status
// @access  Private/Manager/Admin
const updateLeaveStatus = async (req, res, next) => {
  try {
    const { status, managerNote } = req.body;
    const { id } = req.params;

    if (!["Approved", "Rejected", "Cancelled"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Use Approved, Rejected, or Cancelled",
      });
    }

    // Check if user is authorized to update status
    if (req.user.role !== "admin" && req.user.role !== "manager") {
      return res.status(403).json({
        success: false,
        message:
          "Access denied. Only managers and admins can update leave status.",
      });
    }

    const leave = await Leave.findById(id);
    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave request not found",
      });
    }

    // Update status and approval details
    leave.status = status;
    leave.approvedBy = req.user.id;
    leave.approvedDate = Date.now();
    if (managerNote) leave.managerNote = managerNote;

    await leave.save();

    res.status(200).json({
      success: true,
      message: `Leave request ${status.toLowerCase()} successfully`,
      data: leave,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel leave request
// @route   PUT /api/leave/request/:id/cancel
// @access  Private
const cancelLeaveRequest = async (req, res, next) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave request not found",
      });
    }

    // Check if user can cancel this request
    if (leave.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only cancel your own leave requests.",
      });
    }

    // Cannot cancel if already approved/rejected
    if (leave.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel a leave request that is already processed.",
      });
    }

    leave.status = "Cancelled";
    await leave.save();

    res.status(200).json({
      success: true,
      message: "Leave request cancelled successfully",
      data: leave,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get leave balance for a user
// @route   GET /api/leave/balance/:userId
// @access  Private
const getLeaveBalance = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;
    const userRole = req.user.role;

    // Only allow users to view their own balance unless they are admin/manager
    const queryUserId =
      userRole === "admin" || userRole === "manager" ? userId : currentUserId;

    // Calculate leave balance based on company policy
    // For demonstration, using fixed leave allocation
    const totalCasualLeave = 12;
    const totalVacationLeave = 15;
    const totalSickLeave = 10;

    // Get approved leaves for the current year
    const currentYear = new Date().getFullYear();
    const startDateOfYear = new Date(currentYear, 0, 1);
    const endDateOfYear = new Date(currentYear, 11, 31);

    const approvedLeaves = await Leave.find({
      user: queryUserId,
      status: "Approved",
      startDate: { $gte: startDateOfYear, $lte: endDateOfYear },
    });

    // Calculate used leaves by type
    let usedCasual = 0;
    let usedVacation = 0;
    let usedSick = 0;

    approvedLeaves.forEach((leave) => {
      const days =
        Math.ceil(
          (new Date(leave.endDate) - new Date(leave.startDate)) /
            (1000 * 60 * 60 * 24)
        ) + 1;

      switch (leave.leaveType) {
        case "Casual":
          usedCasual += days;
          break;
        case "Vacation":
          usedVacation += days;
          break;
        case "Sick":
          usedSick += days;
          break;
      }
    });

    const leaveBalance = {
      casual: {
        total: totalCasualLeave,
        used: usedCasual,
        remaining: totalCasualLeave - usedCasual,
      },
      vacation: {
        total: totalVacationLeave,
        used: usedVacation,
        remaining: totalVacationLeave - usedVacation,
      },
      sick: {
        total: totalSickLeave,
        used: usedSick,
        remaining: totalSickLeave - usedSick,
      },
    };

    res.status(200).json({
      success: true,
      data: leaveBalance,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all leave types
// @route   GET /api/leave/types
// @access  Public
const getLeaveTypes = async (req, res, next) => {
  try {
    const leaveTypes = [
      "Casual",
      "Vacation",
      "Sick",
      "Personal",
      "Maternity",
      "Paternity",
      "Unpaid",
    ];

    res.status(200).json({
      success: true,
      data: leaveTypes,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  applyLeave,
  getLeaveRequests,
  getLeaveRequest,
  updateLeaveStatus,
  cancelLeaveRequest,
  getLeaveBalance,
  getLeaveTypes,
};
