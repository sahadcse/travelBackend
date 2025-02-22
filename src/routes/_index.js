const Router = require("../utils/Router");
const logger = require("../utils/logger");
const { protect } = require("../middleware/auth.middleware");

// Create routers
const mainRouter = new Router();
const apiRouter = new Router("/api/v1");

// Root routes
mainRouter.get("/", (req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Welcome to Hotel Booking API" }));
});

// Public routes
apiRouter.use("/auth", require("./auth.route"));

// Protected routes
const userRoutes = require("./user.route");
const serviceRoutes = require("./service.route");
const transportRoutes = require("./transport.route");
const bookingRoutes = require("./booking.route");

// First apply protection
apiRouter.use(protect);

// Then mount protected routes
apiRouter.use("/users", userRoutes);
apiRouter.use("/services", serviceRoutes);
apiRouter.use("/transports", transportRoutes);
apiRouter.use("/bookings", bookingRoutes);

// Mount API router
mainRouter.use(apiRouter);

module.exports = mainRouter;
