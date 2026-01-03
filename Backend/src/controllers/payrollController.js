const Payroll = require("../models/Payroll");
const User = require("../models/User");

// @desc    Get payroll history for a user
// @route   GET /api/payroll/history
// @access  Private
const getPayrollHistory = async (req, res, next) => {
  try {
    const { userId, page = 1, limit = 10 } = req.query;
    const currentUserId = req.user.id;
    const userRole = req.user.role;

    // Only allow users to view their own payroll unless they are admin/manager
    const queryUserId =
      userRole === "admin" || userRole === "manager"
        ? userId || currentUserId
        : currentUserId;

    const payrollHistory = await Payroll.find({ user: queryUserId })
      .populate("user", "name email")
      .populate("generatedBy", "name email")
      .sort({ paymentDate: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Payroll.countDocuments({ user: queryUserId });

    res.status(200).json({
      success: true,
      count: payrollHistory.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: payrollHistory,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get payroll details by ID
// @route   GET /api/payroll/details/:id
// @access  Private
const getPayrollDetails = async (req, res, next) => {
  try {
    const payroll = await Payroll.findById(req.params.id)
      .populate("user", "name email position department")
      .populate("generatedBy", "name email");

    if (!payroll) {
      return res.status(404).json({
        success: false,
        message: "Payroll record not found",
      });
    }

    // Check if user can access this record
    if (
      req.user.role !== "admin" &&
      req.user.role !== "manager" &&
      payroll.user._id.toString() !== req.user.id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.status(200).json({
      success: true,
      data: payroll,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate payroll for a user
// @route   POST /api/payroll/generate
// @access  Private/Admin
const generatePayroll = async (req, res, next) => {
  try {
    const {
      userId,
      period,
      basicSalary,
      allowances,
      bonuses,
      deductions,
      tax,
      remarks,
    } = req.body;

    // Check if user is authorized
    if (req.user.role !== "admin" && req.user.role !== "manager") {
      return res.status(403).json({
        success: false,
        message:
          "Access denied. Only admins and managers can generate payroll.",
      });
    }

    // Validate required fields
    if (!userId || !period || basicSalary === undefined) {
      return res.status(400).json({
        success: false,
        message: "User ID, period, and basic salary are required",
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if payroll already exists for this period
    const existingPayroll = await Payroll.findOne({ user: userId, period });
    if (existingPayroll) {
      return res.status(400).json({
        success: false,
        message: "Payroll already exists for this period",
      });
    }

    // Calculate net salary
    const netSalary =
      basicSalary +
      (allowances || 0) +
      (bonuses || 0) -
      (deductions || 0) -
      (tax || 0);

    const payroll = await Payroll.create({
      user: userId,
      period,
      basicSalary,
      allowances: allowances || 0,
      bonuses: bonuses || 0,
      deductions: deductions || 0,
      tax: tax || 0,
      netSalary,
      generatedBy: req.user.id,
      remarks: remarks || "",
    });

    res.status(201).json({
      success: true,
      message: "Payroll generated successfully",
      data: payroll,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update payroll record
// @route   PUT /api/payroll/:id
// @access  Private/Admin
const updatePayroll = async (req, res, next) => {
  try {
    const allowedFields = [
      "basicSalary",
      "allowances",
      "bonuses",
      "deductions",
      "tax",
      "status",
      "paymentDate",
      "paymentMethod",
      "remarks",
    ];
    const updateData = {};

    // Only allow specific fields to be updated
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    // Check if user is authorized
    if (req.user.role !== "admin" && req.user.role !== "manager") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only admins and managers can update payroll.",
      });
    }

    // Calculate net salary if any salary components are updated
    if (
      updateData.basicSalary !== undefined ||
      updateData.allowances !== undefined ||
      updateData.bonuses !== undefined ||
      updateData.deductions !== undefined ||
      updateData.tax !== undefined
    ) {
      const basicSalary =
        updateData.basicSalary !== undefined
          ? updateData.basicSalary
          : req.body.basicSalary;
      const allowances =
        updateData.allowances !== undefined
          ? updateData.allowances
          : req.body.allowances || 0;
      const bonuses =
        updateData.bonuses !== undefined
          ? updateData.bonuses
          : req.body.bonuses || 0;
      const deductions =
        updateData.deductions !== undefined
          ? updateData.deductions
          : req.body.deductions || 0;
      const tax =
        updateData.tax !== undefined ? updateData.tax : req.body.tax || 0;

      updateData.netSalary =
        basicSalary + allowances + bonuses - deductions - tax;
    }

    const payroll = await Payroll.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("user", "name email")
      .populate("generatedBy", "name email");

    if (!payroll) {
      return res.status(404).json({
        success: false,
        message: "Payroll record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payroll record updated successfully",
      data: payroll,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete payroll record
// @route   DELETE /api/payroll/:id
// @access  Private/Admin
const deletePayroll = async (req, res, next) => {
  try {
    // Check if user is authorized
    if (req.user.role !== "admin" && req.user.role !== "manager") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only admins and managers can delete payroll.",
      });
    }

    const payroll = await Payroll.findByIdAndDelete(req.params.id);

    if (!payroll) {
      return res.status(404).json({
        success: false,
        message: "Payroll record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payroll record deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get payroll summary for a user
// @route   GET /api/payroll/summary/:userId
// @access  Private
const getPayrollSummary = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;
    const userRole = req.user.role;

    // Only allow users to view their own summary unless they are admin/manager
    const queryUserId =
      userRole === "admin" || userRole === "manager" ? userId : currentUserId;

    const payrolls = await Payroll.find({ user: queryUserId });

    if (payrolls.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          totalPayrolls: 0,
          totalEarnings: 0,
          totalDeductions: 0,
          averageNetSalary: 0,
        },
      });
    }

    const summary = payrolls.reduce(
      (acc, payroll) => {
        acc.totalEarnings +=
          payroll.basicSalary + payroll.allowances + payroll.bonuses;
        acc.totalDeductions += payroll.deductions + payroll.tax;
        acc.totalNetSalary += payroll.netSalary;
        return acc;
      },
      {
        totalPayrolls: payrolls.length,
        totalEarnings: 0,
        totalDeductions: 0,
        totalNetSalary: 0,
      }
    );

    summary.averageNetSalary = summary.totalNetSalary / summary.totalPayrolls;

    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Process payroll payment
// @route   PUT /api/payroll/:id/process-payment
// @access  Private/Admin
const processPayment = async (req, res, next) => {
  try {
    const { paymentDate, paymentMethod } = req.body;

    // Check if user is authorized
    if (req.user.role !== "admin" && req.user.role !== "manager") {
      return res.status(403).json({
        success: false,
        message:
          "Access denied. Only admins and managers can process payments.",
      });
    }

    const payroll = await Payroll.findByIdAndUpdate(
      req.params.id,
      {
        status: "Paid",
        paymentDate: paymentDate || Date.now(),
        paymentMethod: paymentMethod || "Bank Transfer",
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("user", "name email")
      .populate("generatedBy", "name email");

    if (!payroll) {
      return res.status(404).json({
        success: false,
        message: "Payroll record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment processed successfully",
      data: payroll,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPayrollHistory,
  getPayrollDetails,
  generatePayroll,
  updatePayroll,
  deletePayroll,
  getPayrollSummary,
  processPayment,
};
