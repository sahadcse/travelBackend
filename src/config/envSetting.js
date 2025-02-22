const dot_env = require("dotenv");
dot_env.config();

const envSetting = {
  port: process.env.PORT || 4000,
  dbHost: process.env.DB_HOST,
  dbName: process.env.DB_NAME,
  jwtSecret: process.env.JWT_SECRET,
};

module.exports = envSetting;
