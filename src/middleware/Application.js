const Router = require("../utils/Router");
const logger = require("../utils/logger");
const { parseBody, error } = require("../utils/http");

class Application {
  constructor() {
    this.router = new Router();
    this.errorHandlers = [];
  }

  // Delegate routing methods to router instance
  get(path, handler) {
    this.router.get(path, handler);
  }
  post(path, handler) {
    this.router.post(path, handler);
  }
  put(path, handler) {
    this.router.put(path, handler);
  }
  patch(path, handler) {
    this.router.patch(path, handler);
  }
  delete(path, handler) {
    this.router.delete(path, handler);
  }

  use(path, handler) {
    if (!handler) {
      handler = path;
      path = "/";
    }

    if (!handler) {
      throw new Error("Handler is required for use()");
    }

    if (typeof handler === "function" && handler.length === 4) {
      // Error handler: (err, req, res, next)
      this.errorHandlers.push(handler);
      return;
    }

    this.router.use(path, handler);
    return this;
  }

  async handle(req, res) {
    try {
      // Set headers
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
      );
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
      );
      res.setHeader("Content-Type", "application/json");

      if (req.method === "OPTIONS") {
        res.writeHead(200);
        res.end();
        return;
      }

      // Parse URL to get pathname only
      const url = new URL(req.url, `http://${req.headers.host}`);
      req.url = url.pathname;

      // Parse body for non-GET requests
      if (req.method !== "GET") {
        req.body = await parseBody(req);
      }

      // Process routes
      await new Promise((resolve, reject) => {
        this.router.handle(req, res, (err) => {
          if (err) {
            this.handleError(err, req, res);
            reject(err);
          } else if (!res.headersSent) {
            error(res, `Route not found: ${req.method} ${req.url}`, 404);
          }
          resolve();
        });
      });
    } catch (err) {
      this.handleError(err, req, res);
    }
  }

  handleError(err, req, res) {
    logger.error(`${req.method} ${req.url}`, err);

    // Run custom error handlers
    for (const handler of this.errorHandlers) {
      try {
        handler(err, req, res, (e) => {
          if (e) err = e;
        });
        if (res.headersSent) return;
      } catch (e) {
        err = e;
      }
    }

    // Default error response if no custom handler sent response
    if (!res.headersSent) {
      const status = err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      error(res, message, status);
    }
  }

  listen(port, callback) {
    const server = require("http").createServer((req, res) => {
      this.handle(req, res);
    });
    server.listen(port, callback);
    return server;
  }
}

module.exports = Application;
