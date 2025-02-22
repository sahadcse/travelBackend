const logger = require("../utils/logger");

const loggingMiddleware = (req, res, next) => {
  logger.route(req);
  next();
};

const errorHandlingMiddleware = (err, req, res, next) => {
  console.error("Middleware Error Handling", err);
  res.statusCode = 500;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ message: "Server error" }));
};

module.exports = {
  loggingMiddleware,
  errorHandlingMiddleware,
};
