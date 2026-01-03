const express = require("express");
const {
  markAttendance,
  getAttendanceRecords,
  getAttendanceById,
  getMonthlyReport,
  updateAttendance,
  deleteAttendance,
} = require("../controllers/attendanceController");
const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/mark").post(protect, markAttendance);
router.route("/").get(protect, getAttendanceRecords);
router.route("/monthly-report").get(protect, getMonthlyReport);
router
  .route("/:id")
  .get(protect, getAttendanceById)
  .put(protect, authorize("admin", "manager"), updateAttendance)
  .delete(protect, authorize("admin", "manager"), deleteAttendance);

module.exports = router;
