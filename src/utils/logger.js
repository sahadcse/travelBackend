const logger = {
  info: (message, ...args) => {
    console.log(`[${new Date().toISOString()}] [INFO] ${message}`, ...args);
  },
  debug: (message, ...args) => {
    console.log(`[${new Date().toISOString()}] [DEBUG] ${message}`, ...args);
  },
  error: (message, error) => {
    console.error(`[${new Date().toISOString()}] [ERROR] ${message}`, error);
  },
  warn: (...messages) => {
    console.warn(`[${new Date().toISOString()}] [WARN]`, ...messages);
  },
  route: (req) => {
    console.log(
      `[${new Date().toISOString()}] [ROUTE] ${req.method} ${req.url}`
    );
  },
};

module.exports = logger;
