const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// @desc    Register user (Sign Up)
// @route   POST /api/auth/signup
// @access  Public
const signUp = async (req, res, next) => {
  try {
    const { employeeId, name, email, password, role } = req.body;

    // Check if employeeId already exists
    const existingEmployeeId = await User.findOne({ employeeId });
    if (existingEmployeeId) {
      return res.status(400).json({
        success: false,
        message: "Employee ID already exists",
      });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Validate role
    if (role && !["EMPLOYEE", "ADMIN"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Must be EMPLOYEE or ADMIN",
      });
    }

    // Create user
    const user = await User.create({
      employeeId,
      name,
      email,
      password,
      role: role || "EMPLOYEE",
      isVerified: true,
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        token,
        user: {
          id: user._id,
          employeeId: user.employeeId,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user (Sign In)
// @route   POST /api/auth/signin
// @access  Public
const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user by email (password is not selected by default)
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user._id,
          employeeId: user.employeeId,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signUp,
  signIn,
};
