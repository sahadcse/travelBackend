/**
 * Authentication Middleware
 */
const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");
const User = require("../models/userModel");

/**
 * Extracts token from the Authorization header
 */
const extractToken = (authHeader) => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    logger.warn("[Auth] No Bearer token found");
    return null;
  }
  return authHeader.split(" ")[1];
};

/**
 * Checks if a user exists
 */
const checkUserExistence = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    logger.warn("[Auth] User not found");
    return null;
  }
  return user;
};

/**
 * Protects routes by verifying JWT token
 */
const protect = async (req, res, next) => {
  // logger.info("[Auth] Checking authorization header");
  const authHeader = req.headers.authorization;

  const token = extractToken(authHeader);
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Please login to access this route",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // logger.info("[Auth] Token verified for user:", decoded.id);

    const currentUser = await checkUserExistence(decoded.id);
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = currentUser;
    return next();
  } catch (err) {
    logger.error("[Auth] Token verification failed:", err.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

/**
 * Restricts access based on user roles
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    // logger.info("[Auth] Checking role restriction:", roles);
    // logger.info("[Auth] User role:", req.user?.role);

    if (!req.user || !roles.includes(req.user.role)) {
      logger.warn("[Auth] Access denied - insufficient permissions");
      return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action",
      });
    }

    // logger.info("[Auth] Role check passed for:", req.user.role);
    return next();
  };
};

module.exports = { protect, restrictTo };
