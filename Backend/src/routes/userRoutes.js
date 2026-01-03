const express = require("express");
const {
  getUsers,
  getUserById,
  updateUser,
  updateUserRole,
  deleteUser,
  getProfile,
  updateProfile,
} = require("../controllers/userController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const { isAdmin } = require("../middlewares/roleMiddleware");

const router = express.Router();

// Routes for all users
router.route("/profile").get(protect, getProfile).put(protect, updateProfile);

// Admin only routes
router.route("/").get(protect, isAdmin, getUsers);

router
  .route("/:id")
  .get(protect, getUserById)
  .put(protect, isAdmin, updateUser)
  .delete(protect, isAdmin, deleteUser);

router.route("/:id/role").put(protect, isAdmin, updateUserRole);

module.exports = router;
