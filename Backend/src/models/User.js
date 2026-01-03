const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: [true, "Employee ID is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["EMPLOYEE", "ADMIN"],
      default: "EMPLOYEE",
      required: true,
    },
    phone: {
      type: String,
      trim: true,
      match: [/^\+?[\d\s-()]+$/, "Please enter a valid phone number"],
    },
    address: {
      type: String,
      trim: true,
    },
    jobDetails: {
      position: {
        type: String,
        trim: true,
        maxlength: [50, "Position cannot exceed 50 characters"],
      },
      department: {
        type: String,
        trim: true,
        maxlength: [50, "Department cannot exceed 50 characters"],
      },
      dateOfJoining: {
        type: Date,
      },
    },
    salaryStructure: {
      basicSalary: {
        type: Number,
        min: [0, "Basic salary cannot be negative"],
      },
      allowances: {
        type: Number,
        default: 0,
        min: [0, "Allowances cannot be negative"],
      },
      deductions: {
        type: Number,
        default: 0,
        min: [0, "Deductions cannot be negative"],
      },
    },
    profilePicture: {
      type: String,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Indexes
userSchema.index({ employeeId: 1 });
userSchema.index({ email: 1 });

module.exports = mongoose.model("User", userSchema);
