/**
 * User route definitions for managing user CRUD operations.
 * Handles authentication and role-based access control for user management.
 */

const router = require("express").Router();
const { getAllUsers, getUserById, createUser, updateUser, deleteUser} = require("../controllers/user.controller");
const { restrictTo } = require("../middleware/auth.middleware");

// Get all users - Admin only
router.get("/all", restrictTo("admin"), getAllUsers);

// Get user by ID - Accessible by admin, customer and provider
router.get("/single/:id", restrictTo("admin", "customer", "provider"), getUserById);

// Create new user - Admin only
router.post("/create", restrictTo("admin"), createUser);

// Update user - Accessible by admin and customer
router.put("/update/:id", restrictTo("admin", "customer"), updateUser);

// Delete user - Admin only
router.delete("/delete/:id", restrictTo("admin"), deleteUser);

// router.post("/logout", ctrl.logout);
// router.patch("/reset-password/:token", ctrl.resetPassword);
// router.patch("/update-password", ctrl.updatePassword);

module.exports = router;
