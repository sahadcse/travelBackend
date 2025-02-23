const express = require("express");
const { protect } = require("../middleware/auth.middleware");

const userRoutes = require("./user.route");
const authRoutes = require("./auth.route");
const serviceRoutes = require("./service.route");
const bookingRoutes = require("./booking.route");
const transportRoutes = require("./transport.route");

const router = express.Router();

// Base route
router.get("/", (req, res) => {
  res.status(200).json({
    status: 200,
    message: "Welcome to the Hotel Booking API",
  });
});

// Public routes
router.use("/api/v1/auth", authRoutes);

// Protected routes
router.use("/api/v1/users", protect, userRoutes);
router.use("/api/v1/services", protect, serviceRoutes);
router.use("/api/v1/bookings", protect, bookingRoutes);
router.use("/api/v1/transports", protect, transportRoutes);

// not found route handler
router.use((req, res, next) => {
  const error = new Error("Resource not found");
  error.status = 404;
  next(error);
});

module.exports = router;
