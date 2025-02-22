const Router = require("../router/router");
const ResponseHandler = require("../utils/ResponseHandler");
const { protect } = require("../middleware/auth.middleware");

const userRoutes = require("./user.route");
const authRoutes = require("./auth.route");
const serviceRoutes = require("./service.route");
const bookingRoutes = require("./booking.route");
const transportRoutes = require("./transport.route");

const router = new Router();

// Define a simple base route
router.get("/", (req, res) => {
  ResponseHandler.success(res, { message: "Welcome to the API" });
});

// Middleware-like function to mount routers
router.use("/api/v1/users", userRoutes);
router.use("/api/v1/auth", authRoutes);
router.use("/api/v1/services", serviceRoutes);
router.use("/api/v1/bookings", bookingRoutes);
router.use("/api/v1/transports", transportRoutes);

console.log("Routes registered in index.js"); // Debugging log
router.logRoutes(); // Log all registered routes

module.exports = router.route.bind(router);
