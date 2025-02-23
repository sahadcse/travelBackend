const {
  register: registerService,
  login: loginService,
  forgotPassword: forgotPasswordService,
  resetPassword: resetPasswordService,
} = require("../services/auth.service");
const logger = require("../utils/logger");

const register = async (req, res) => {
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

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({
      success: false,
      message: "Email, password, firstName and lastName are required",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters long",
    });
  }

  try {
    const newUserData = {
      email,
      password,
      firstName,
      lastName,
      phone,
      address: address || {},
      preferences: preferences || {},
      role: role || "customer",
    };

    const { token, user } = await registerService(newUserData);
    logger.info(`${role} registered successfully: ${email}`);

    return res.status(201).json({
      success: true,
      message: `${role} registered successfully`,
      token,
      user,
    });
  } catch (error) {
    logger.error(`Registration failed: ${error.message}`);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Registration failed",
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  try {
    const { token, user } = await loginService(email, password);
    const authenticatedUser = {
      ...user,
      lastLogin: new Date(),
    };

    logger.info(`${authenticatedUser?.role} logged in successfully: ${email}`);
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: authenticatedUser,
    });
  } catch (error) {
    logger.error(`Login failed: ${error.message}`);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Login failed",
    });
  }
};

const logout = async (req, res) => {
  const userEmail = req.user?.email;
  logger.info(`User logged out: ${userEmail}`);
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  try {
    await forgotPasswordService(email);
    logger.info(`Password reset requested for: ${email}`);
    return res.status(200).json({
      success: true,
      message: "Password reset instructions sent",
    });
  } catch (error) {
    logger.error(`Password reset request failed: ${error.message}`);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Password reset failed",
    });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!token || !password) {
    return res.status(400).json({
      success: false,
      message: "Token and new password are required",
    });
  }

  try {
    await resetPasswordService(token, password);
    logger.info("Password reset successful");
    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    logger.error(`Password reset failed: ${error.message}`);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Password reset failed",
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
};
