const express = require("express");
const {
  checkIn,
  checkOut,
  getAttendance,
  getWeeklyAttendance,
} = require("../controllers/attendanceController");
const { protect } = require("../middlewares/authMiddleware");
const { isEmployee } = require("../middlewares/roleMiddleware");

const router = express.Router();

router.route("/checkin").post(protect, isEmployee, checkIn);
router.route("/checkout").post(protect, isEmployee, checkOut);
router.route("/").get(protect, getAttendance);
router.route("/weekly").get(protect, getWeeklyAttendance);

module.exports = router;
