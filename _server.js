/**
 * Main application entry point
 * Sets up the HTTP server, database connection, and middleware
 */

// External dependencies
const http = require("http");
const dotenv = require("dotenv");
const { networkInterfaces } = require("os");
const logger = require("./src/utils/logger");

// Internal dependencies
const connectDB = require("./src/config/DB");
const setupMiddleware = require("./src/middleware/setup");
const apiRoutes = require("./src/routes");

// Load environment variables
dotenv.config();
const port = process.env.PORT || 9000;

// Create application
const app = setupMiddleware();

// Add debug logging middleware
app.use((req, res, next) => {
  logger.info(`[Request] ${req.method} ${req.url}`);
  logger.info(
    `[Headers] Authorization: ${req.headers.authorization ? "Present" : "Missing"}`
  );
  next();
});

// Mount API routes directly
app.use(apiRoutes);

// Start server after DB connection
connectDB()
  .then(() => {
    app.listen(port, () => {
      logger.info(`Server running on port ${port}`);
      logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  })
  .catch((err) => {
    logger.error("Database connection failed:", err);
    process.exit(1);
  });
