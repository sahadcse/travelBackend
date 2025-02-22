const AuthService = require("../services/auth.service");
const logger = require("../utils/logger");
const ResponseHandler = require("../utils/ResponseHandler");

/**
 * Authentication Controller
 * Handles all authentication related operations including registration, login, logout,
 * and password management
 */
class AuthController {
  /**
   * Initialize controller with auth service instance
   */
  constructor() {
    this.authService = new AuthService();
    // Bind methods to instance
    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
    this.logout = this.logout.bind(this);
    this.forgotPassword = this.forgotPassword.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
  }

  /**
   * Register a new user
   * @param {Request} req - Express request object containing user registration data
   * @param {Response} res - Express response object
   * @returns {Promise<void>} - JSON response with user data and token
   */
  async register(req, res) {
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      address,
      preferences,
      role,
    } = req.body || {};

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return ResponseHandler.error(
        res,
        "Email, password, firstName and lastName are required",
        400
      );
    }

    // Validate password length
    if (password.length < 6) {
      return ResponseHandler.error(
        res,
        "Password must be at least 6 characters long",
        400
      );
    }

    try {
      // Prepare user data with default values
      const userData = {
        email,
        password,
        firstName,
        lastName,
        phone,
        address: address || {},
        preferences: preferences || {},
        role: role || "customer",
      };

      // Attempt user registration
      const result = await this.authService.register(userData);
      logger.info(`${role} registered successfully: ${email}`);
      ResponseHandler.success(res, {
        message: `${role} registered successfully`,
        token: result.token,
        user: result.user,
      });
    } catch (err) {
      logger.error(`Registration failed: ${err.message}`);
      ResponseHandler.error(
        res,
        err.message || "Registration failed",
        err.statusCode || 400
      );
    }
  }

  /**
   * Authenticate user login
   * @param {Request} req - Express request object containing login credentials
   * @param {Response} res - Express response object
   * @returns {Promise<void>} - JSON response with user data and token
   */
  async login(req, res) {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return ResponseHandler.error(res, "Email and password are required", 400);
    }

    try {
      const result = await this.authService.login(email, password);

      // Add last login time to response
      const userData = {
        ...result.user,
        lastLogin: new Date(),
      };

      logger.info(`${userData?.role} logged in successfully: ${email}`);
      ResponseHandler.success(res, {
        message: "Login successful",
        token: result.token,
        user: userData,
      });
    } catch (err) {
      logger.error(`Login failed: ${err.message}`);
      ResponseHandler.error(
        res,
        err.message || "Login failed",
        err.statusCode || 401
      );
    }
  }

  /**
   * Handle user logout
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<void>} - Success message
   */
  async logout(req, res) {
    // Since we're using JWT, we just need to let the client remove the token
    logger.info(`User logged out: ${req.user?.email}`);
    ResponseHandler.success(res, { message: "Logged out successfully" });
  }

  /**
   * Initiate password reset process
   * @param {Request} req - Express request object containing user email
   * @param {Response} res - Express response object
   * @returns {Promise<void>} - JSON response with reset token
   */
  async forgotPassword(req, res) {
    const { email } = req.body;

    if (!email) {
      return ResponseHandler.error(res, "Email is required", 400);
    }

    try {
      // Check if user exists before attempting password reset
      const result = await this.authService.forgotPassword(email);

      if (!result.success) {
        return ResponseHandler.error(res, "No user found with this email", 404);
      }

      logger.info(`Password reset requested for: ${email}`);
      ResponseHandler.success(res, {
        message: "Password reset instructions sent",
        resetToken: result.resetToken,
      });
    } catch (err) {
      logger.error(`Password reset request failed: ${err.message}`);
      ResponseHandler.error(
        res,
        err.message || "Password reset failed",
        err.statusCode || 400
      );
    }
  }

  /**
   * Complete password reset process
   * @param {Request} req - Express request object containing reset token and new password
   * @param {Response} res - Express response object
   * @returns {Promise<void>} - Success message
   */
  async resetPassword(req, res) {
    const { token } = req.params;
    const { password } = req.body;

    if (!token || !password) {
      return ResponseHandler.error(
        res,
        "Token and new password are required",
        400
      );
    }

    try {
      await this.authService.resetPassword(token, password);
      logger.info("Password reset successful");
      ResponseHandler.success(res, { message: "Password reset successful" });
    } catch (err) {
      logger.error(`Password reset failed: ${err.message}`);
      ResponseHandler.error(
        res,
        err.message || "Password reset failed",
        err.statusCode || 400
      );
    }
  }

  /**
   * Utility method to send error responses
   * @param {Response} res - Express response object
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   */
  sendError(res, message, statusCode = 500) {
    if (!res.headersSent) {
      res.writeHead(statusCode, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          status: "error",
          message,
          timestamp: new Date().toISOString(),
        })
      );
    }
  }
}

module.exports = AuthController;
