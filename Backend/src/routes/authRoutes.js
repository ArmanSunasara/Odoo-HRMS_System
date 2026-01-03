const express = require("express");
const {
  registerUser,
  loginUser,
  getMe,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/me").get(protect, getMe);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:resetToken").post(resetPassword);

module.exports = router;
