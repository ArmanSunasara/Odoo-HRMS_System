const express = require("express");
const {
  getEmployeeDashboard,
  getAdminDashboard,
} = require("../controllers/dashboardController");
const { protect } = require("../middlewares/authMiddleware");
const { isEmployee, isAdmin } = require("../middlewares/roleMiddleware");

const router = express.Router();

router.route("/employee").get(protect, isEmployee, getEmployeeDashboard);
router.route("/admin").get(protect, isAdmin, getAdminDashboard);

module.exports = router;

