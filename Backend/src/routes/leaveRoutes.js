const express = require("express");
const {
  applyLeave,
  getLeaveRequests,
  updateLeaveStatus,
} = require("../controllers/leaveController");
const { protect } = require("../middlewares/authMiddleware");
const { isEmployee, isAdmin } = require("../middlewares/roleMiddleware");
const {
  applyLeaveValidationRules,
  updateLeaveStatusValidationRules,
  validate,
} = require("../utils/validators");

const router = express.Router();

router
  .route("/apply")
  .post(
    protect,
    isEmployee,
    applyLeaveValidationRules(),
    validate,
    applyLeave
  );
router.route("/").get(protect, getLeaveRequests);
router
  .route("/:id/status")
  .put(
    protect,
    isAdmin,
    updateLeaveStatusValidationRules(),
    validate,
    updateLeaveStatus
  );

module.exports = router;
