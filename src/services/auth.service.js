const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const dotenv = require("dotenv");
const logger = require("../utils/logger");
dotenv.config();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const register = async (userData) => {
  // Check if user exists
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    const error = new Error("Email already exists");
    error.statusCode = 400;
    throw error;
  }

  // Create user
  const user = await User.create({
    ...userData,
    password: await bcrypt.hash(userData.password, 12),
  });

  const token = generateToken(user._id);

  // Remove password from output
  user.password = undefined;

  return { token, user };
};

const login = async (email, password) => {
  logger.debug("Attempting login for email:", email);

  // Find user
  const user = await User.findOne({ email }).select("+password");
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
  const token = generateToken(user._id);

  // Remove sensitive data
  const userResponse = user.toObject();
  delete userResponse.password;

  return { token, user: userResponse };
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    const err = new Error("Invalid token");
    err.statusCode = 401;
    throw err;
  }
};

const forgotPassword = async (email) => {
  // Implementation for password reset functionality
  const error = new Error("Not implemented");
  error.statusCode = 501;
  throw error;
};

const resetPassword = async (token, newPassword) => {
  // Implementation for password reset
  const error = new Error("Not implemented");
  error.statusCode = 501;
  throw error;
};

module.exports = {
  generateToken,
  register,
  login,
  verifyToken,
  forgotPassword,
  resetPassword,
};
