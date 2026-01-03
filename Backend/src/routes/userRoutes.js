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

const router = express.Router();

// Routes for all users
router.route("/profile").get(protect, getProfile).put(protect, updateProfile);

// Admin only routes
router
  .route("/")
  .get(protect, authorize("admin"), getUsers)
  .post(protect, authorize("admin"), updateUser); // This route doesn't exist, will create later

router
  .route("/:id")
  .get(protect, getUserById)
  .put(protect, authorize("admin", "manager"), updateUser)
  .delete(protect, authorize("admin"), deleteUser);

router.route("/:id/role").put(protect, authorize("admin"), updateUserRole);

module.exports = router;
