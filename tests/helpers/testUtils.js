const jwt = require("jsonwebtoken");

/**
 * Create test user data
 */
const createTestUser = (override = {}) => ({
  name: "Test User",
  email: "test@example.com",
  password: "password123",
  role: "customer",
  ...override,
});

/**
 * Generate test JWT token
 */
const generateTestToken = (userId, role = "customer") => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

/**
 * Clean up test data
 */
const cleanupTestData = async (models) => {
  for (const Model of models) {
    await Model.deleteMany({});
  }
};

module.exports = {
  createTestUser,
  generateTestToken,
  cleanupTestData,
};
