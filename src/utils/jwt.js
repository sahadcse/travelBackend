const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const generateToken = (user) => {
  // Extract id if user is an object, otherwise use user directly as id
  const userId = user._id || user.id || user;
  const userRole = user.role || "customer";

  const token = jwt.sign(
    { id: userId, role: userRole },
    process.env.JWT_SECRET || "your-secret-key",
    { expiresIn: "30d" }
  );
  return token;
};

module.exports = { generateToken };
