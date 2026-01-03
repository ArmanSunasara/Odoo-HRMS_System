const express = require("express");
const {
  getPayrollHistory,
  getPayrollDetails,
  generatePayroll,
  updatePayroll,
  deletePayroll,
  getPayrollSummary,
  processPayment,
} = require("../controllers/payrollController");
const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/history").get(protect, getPayrollHistory);
router.route("/details/:id").get(protect, getPayrollDetails);
router.route("/summary/:userId").get(protect, getPayrollSummary);
router
  .route("/generate")
  .post(protect, authorize("admin", "manager"), generatePayroll);
router
  .route("/:id")
  .put(protect, authorize("admin", "manager"), updatePayroll)
  .delete(protect, authorize("admin", "manager"), deletePayroll);
router
  .route("/:id/process-payment")
  .put(protect, authorize("admin", "manager"), processPayment);

module.exports = router;
