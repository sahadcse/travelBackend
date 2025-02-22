/**
 * Authentication Middleware
 */
const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");
const { error } = require("../utils/http");
const User = require("../models/userModel");

/**
 * Protects routes by verifying JWT token
 */
const protect = async (req, res, next) => {
  logger.info("[Auth] Checking authorization header");
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    logger.warn("[Auth] No Bearer token found");
    return error(res, "Please login to access this route", 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    logger.info("[Auth] Token verified for user:", decoded.id);

    // Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      logger.warn("[Auth] User not found");
      return error(res, "User not found", 404);
    }
    req.user = currentUser;

    // console.log("Current user:", decoded.id);
    // console.log(currentUser);
    return next(); // Explicitly return next()
  } catch (err) {
    logger.error("[Auth] Token verification failed:", err.message);
    return error(res, "Invalid or expired token", 401);
  }
};

/**
 * Restricts access based on user roles
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    try {
      logger.info("[Auth] Checking role restriction:", roles);
      logger.info("[Auth] User role:", req.user?.role);

      if (!req.user || !roles.includes(req.user.role)) {
        logger.warn("[Auth] Access denied - insufficient permissions");
        return error(
          res,
          "You do not have permission to perform this action",
          403
        );
      }

      logger.info("[Auth] Role check passed for:", req.user.role);
      return next(); // Explicitly return next()
    } catch (err) {
      logger.error("[Auth] Role restriction error:", err);
      return error(res, "Authorization error", 500);
    }
  };
};

module.exports = { protect, restrictTo };
