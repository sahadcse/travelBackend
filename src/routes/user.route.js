/**
 * User route definitions for managing user CRUD operations.
 * Handles authentication and role-based access control for user management.
 */

const Router = require("../router/router");
const UserController = require("../controllers/user.controller");
const { restrictTo, protect } = require("../middleware/auth.middleware");
const { catchAsync } = require("../utils/catchAsync");

// Initialize router and controller
const router = new Router();
const ctrl = new UserController();

// Get all users - Admin only
router.get(
  "/",
  catchAsync(protect),
  catchAsync(restrictTo("admin")),
  ctrl.getAllUsers
);

// Get user by ID - Accessible by admin, customer and provider
router.get(
  "/:id",
  catchAsync(protect),
  catchAsync(restrictTo("admin", "customer", "provider")),
  ctrl.getUserById
);

// Create new user - Admin only
router.post(
  "/",
  catchAsync(protect),
  catchAsync(restrictTo("admin")),
  ctrl.createUser
);

// Update user - Accessible by admin and customer
router.put(
  "/:id",
  catchAsync(protect),
  catchAsync(restrictTo("admin", "customer")),
  ctrl.updateUser
);

// Delete user - Admin only
router.delete(
  "/:id",
  catchAsync(protect),
  catchAsync(restrictTo("admin")),
  ctrl.deleteUser
);

module.exports = router;
