const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const dotenv = require("dotenv");
const logger = require("../utils/logger");
dotenv.config();

class AuthService {
  generateToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  }

  async register(userData) {
    // Check if user exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new AppError("Email already exists", 400);
    }

    // Create user
    const user = await User.create({
      ...userData,
      password: await bcrypt.hash(userData.password, 12),
    });

    const token = this.generateToken(user._id);

    // Remove password from output
    user.password = undefined;

    return { token, user };
  }

  async login(email, password) {
    logger.debug("Attempting login for email:", email);

    // Find user
    const user = await User.findOne({ email }).select("+password");
    console.log(user);
    if (!user) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    // Generate token
    const token = this.generateToken(user._id);

    // Remove sensitive data
    const userResponse = user.toObject();
    delete userResponse.password;

    return { token, user: userResponse };
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new AppError("Invalid token", 401);
    }
  }

  async forgotPassword(email) {
    // Implementation for password reset functionality
    // This would typically involve sending an email with reset instructions
    throw new AppError("Not implemented", 501);
  }

  async resetPassword(token, newPassword) {
    // Implementation for password reset
    // This would typically verify the reset token and update the password
    throw new AppError("Not implemented", 501);
  }
}

module.exports = AuthService;
