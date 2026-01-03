const Leave = require("../models/Leave");
const User = require("../models/User");

// @desc    Apply for leave
// @route   POST /api/leave/apply
// @access  Private/Employee
const applyLeave = async (req, res, next) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;
    const employeeId = req.user.id;

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    if (start > end) {
      return res.status(400).json({
        success: false,
        message: "End date must be after start date",
      });
    }

    // Check for overlapping leave requests
    const overlappingLeave = await Leave.findOne({
      employee: employeeId,
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
      employee: employeeId,
      leaveType,
      startDate: start,
      endDate: end,
      reason,
      status: "Pending",
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

// @desc    Get leave requests
// @route   GET /api/leave
// @access  Private
const getLeaveRequests = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const employeeId = req.user.id;
    const userRole = req.user.role;

    let filter = {};

    // Employee can only view their own leaves
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

    if (status) {
      filter.status = status;
    }

    const leaveRequests = await Leave.find(filter)
      .populate("employee", "employeeId name email")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Leave.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: "Leave requests retrieved successfully",
      data: {
        requests: leaveRequests,
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

// @desc    Approve or reject leave
// @route   PUT /api/leave/:id/status
// @access  Private/Admin
const updateLeaveStatus = async (req, res, next) => {
  try {
    const { status, adminComment } = req.body;
    const { id } = req.params;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Use Approved or Rejected",
      });
    }

    const leave = await Leave.findById(id);
    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave request not found",
      });
    }

    leave.status = status;
    if (adminComment) {
      leave.adminComment = adminComment;
    }
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

module.exports = {
  applyLeave,
  getLeaveRequests,
  updateLeaveStatus,
};
