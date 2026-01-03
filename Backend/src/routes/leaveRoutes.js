const express = require("express");
const {
  applyLeave,
  getLeaveRequests,
  getLeaveRequest,
  updateLeaveStatus,
  cancelLeaveRequest,
  getLeaveBalance,
  getLeaveTypes,
} = require("../controllers/leaveController");
const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/request").post(protect, applyLeave);
router.route("/requests").get(protect, getLeaveRequests);
router.route("/request/:id").get(protect, getLeaveRequest);
router
  .route("/request/:id/status")
  .put(protect, authorize("admin", "manager"), updateLeaveStatus);
router.route("/request/:id/cancel").put(protect, cancelLeaveRequest);
router.route("/balance/:userId").get(protect, getLeaveBalance);
router.route("/types").get(getLeaveTypes);

module.exports = router;
