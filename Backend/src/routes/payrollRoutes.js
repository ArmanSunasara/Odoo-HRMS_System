const express = require("express");
const {
  getPayroll,
  getPayrollById,
  createPayroll,
  updatePayroll,
} = require("../controllers/payrollController");
const { protect } = require("../middlewares/authMiddleware");
const { isAdmin } = require("../middlewares/roleMiddleware");
const { createPayrollValidationRules, validate } = require("../utils/validators");

const router = express.Router();

router
  .route("/")
  .get(protect, getPayroll)
  .post(protect, isAdmin, createPayrollValidationRules(), validate, createPayroll);
router
  .route("/:id")
  .get(protect, getPayrollById)
  .put(protect, isAdmin, updatePayroll);

module.exports = router;
