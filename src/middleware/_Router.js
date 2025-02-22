/**
 * Router class for handling HTTP requests and middleware
 * Supports path prefixing and middleware chaining
 */
class Router {
  /**
   * Creates a new Router instance
   * @param {string} prefix - Optional URL prefix for all routes
   */
  constructor(prefix = "") {
    this.prefix = prefix;
    this.middleware = [];
    this.routes = [];
  }

  /**
   * Normalizes the path by removing trailing slashes and ensuring leading slash
   * @param {string} path - Path to normalize
   * @returns {string} Normalized path
   */
  _normalizePath(path) {
    path = path.replace(/\/+$/, "").replace(/^\/+/, "/");
    return path === "" ? "/" : path;
  }

  /**
   * Adds middleware to the router
   * @param {string|function|Array} path - URL path, middleware function, or array of middleware
   * @param {...function} handlers - Middleware handler functions
   */
  use(path, ...handlers) {
    if (typeof path === "function" || Array.isArray(path)) {
      handlers = Array.isArray(path) ? path : [path, ...handlers];
      path = "*";
    }

    // Flatten array of middleware
    handlers = handlers.flat();

    // Normalize the path
    const normalizedPath = path === "*" ? path : this._normalizePath(path);

    this.middleware.push({
      path: normalizedPath,
      handlers,
      isMiddleware: true,
    });
  }

  /**
   * Processes the request through middleware chain
   * @param {Object} req - HTTP request object
   * @param {Object} res - HTTP response object
   * @param {function} parentNext - Parent middleware's next function
   */
  handle(req, res, parentNext) {
    let index = 0;
    const baseUrl = this._normalizePath(this.prefix + req.url);

    const next = (err) => {
      if (err) return parentNext?.(err);

      const layer = this.middleware[index++];
      if (!layer) return parentNext?.();

      const pathMatches =
        layer.path === "*" || baseUrl.startsWith(this.prefix + layer.path);

      if (pathMatches) {
        try {
          const executeHandlers = (handlerIndex = 0) => {
            if (handlerIndex >= layer.handlers.length) return next();
            layer.handlers[handlerIndex](req, res, (err) => {
              if (err) return next(err);
              executeHandlers(handlerIndex + 1);
            });
          };
          executeHandlers();
        } catch (error) {
          next(error);
        }
      } else {
        next();
      }
    };
    next();
  }
}

module.exports = Router;
