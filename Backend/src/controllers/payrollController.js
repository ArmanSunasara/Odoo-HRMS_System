const Payroll = require("../models/Payroll");
const User = require("../models/User");

// @desc    Get payroll (Employee can view only their own, Admin can view all)
// @route   GET /api/payroll
// @access  Private
const getPayroll = async (req, res, next) => {
  try {
    const { month, page = 1, limit = 10 } = req.query;
    const employeeId = req.user.id;
    const userRole = req.user.role;

    let filter = {};

    // Employee can only view their own payroll
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

    if (month) {
      filter.month = month;
    }

    const payrolls = await Payroll.find(filter)
      .populate("employee", "employeeId name email")
      .sort({ month: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Payroll.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: "Payroll retrieved successfully",
      data: {
        payrolls,
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

// @desc    Get payroll by ID
// @route   GET /api/payroll/:id
// @access  Private
const getPayrollById = async (req, res, next) => {
  try {
    const payroll = await Payroll.findById(req.params.id).populate(
      "employee",
      "employeeId name email"
    );

    if (!payroll) {
      return res.status(404).json({
        success: false,
        message: "Payroll record not found",
      });
    }

    // Check if user is authorized to view this payroll
    if (
      req.user.role !== "ADMIN" &&
      payroll.employee._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this payroll record",
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

// @desc    Create payroll (Admin only)
// @route   POST /api/payroll
// @access  Private/Admin
const createPayroll = async (req, res, next) => {
  try {
    const { employeeId, month, basicSalary, allowances, deductions } = req.body;

    if (!employeeId || !month || basicSalary === undefined) {
      return res.status(400).json({
        success: false,
        message: "Employee ID, month, and basic salary are required",
      });
    }

    // Find employee
    const employee = await User.findOne({ employeeId });
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // Check if payroll already exists for this month
    const existingPayroll = await Payroll.findOne({
      employee: employee._id,
      month,
    });
    if (existingPayroll) {
      return res.status(400).json({
        success: false,
        message: "Payroll already exists for this month",
      });
    }

    // Calculate net salary
    const netSalary =
      basicSalary + (allowances || 0) - (deductions || 0);

    const payroll = await Payroll.create({
      employee: employee._id,
      month,
      basicSalary,
      allowances: allowances || 0,
      deductions: deductions || 0,
      netSalary,
    });

    res.status(201).json({
      success: true,
      message: "Payroll created successfully",
      data: payroll,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update payroll (Admin only)
// @route   PUT /api/payroll/:id
// @access  Private/Admin
const updatePayroll = async (req, res, next) => {
  try {
    const { basicSalary, allowances, deductions } = req.body;

    const payroll = await Payroll.findById(req.params.id);
    if (!payroll) {
      return res.status(404).json({
        success: false,
        message: "Payroll not found",
      });
    }

    // Update fields if provided
    if (basicSalary !== undefined) payroll.basicSalary = basicSalary;
    if (allowances !== undefined) payroll.allowances = allowances;
    if (deductions !== undefined) payroll.deductions = deductions;

    // Recalculate net salary
    payroll.netSalary =
      payroll.basicSalary + payroll.allowances - payroll.deductions;

    await payroll.save();

    res.status(200).json({
      success: true,
      message: "Payroll updated successfully",
      data: payroll,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPayroll,
  getPayrollById,
  createPayroll,
  updatePayroll,
};
