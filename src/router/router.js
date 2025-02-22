const Route = require("./route");
const ResponseHandler = require("../utils/ResponseHandler");

class Router {
  constructor() {
    this.routes = [];
    this.middleware = [];
  }

  use(path, ...handlers) {
    if (typeof path === "function") {
      this.middleware.push({ path: "/", middleware: [path, ...handlers] });
      return;
    }

    const lastHandler = handlers[handlers.length - 1];
    if (lastHandler instanceof Router) {
      const middlewares = handlers.slice(0, -1);

      lastHandler.routes.forEach((route) => {
        let newPath = path;
        if (route.path && route.path !== "/") {
          newPath += route.path.startsWith("/") ? route.path : `/${route.path}`;
        }

        const chainedHandler = async (req, res, next) => {
          const middlewareStack = [...middlewares];

          const runMiddleware = (index) => {
            if (index >= middlewareStack.length) {
              return route.handler(req, res, next);
            }

            const middleware = middlewareStack[index];
            return middleware(req, res, (err) => {
              if (err) {
                console.error("Middleware error:", err);
                if (!res.writableEnded) {
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: err.message }));
                }
                return;
              }
              return runMiddleware(index + 1);
            });
          };

          return runMiddleware(0);
        };

        this.addRoute(route.method, newPath, chainedHandler);
      });
    } else {
      this.middleware.push({ path, middleware: handlers });
    }
  }

  // Helper to combine multiple route handlers into one chained function
  combineHandlers(handlers) {
    return (req, res, next) => {
      const run = (index) => {
        if (index >= handlers.length) return;
        const handler = handlers[index];
        handler(req, res, (err) => {
          if (err) return next(err);
          run(index + 1);
        });
      };
      run(0);
    };
  }

  addRoute(method, path, handler) {
    const route = new Route(method, path, handler);
    this.routes.push(route);
    console.log(`Registered route: ${method} ${path}`); // Debugging log
  }

  // Updated HTTP method shortcuts accepting multiple handlers:
  get(path, ...handlers) {
    this.addRoute("GET", path, this.combineHandlers(handlers));
  }

  post(path, ...handlers) {
    this.addRoute("POST", path, this.combineHandlers(handlers));
  }

  put(path, ...handlers) {
    this.addRoute("PUT", path, this.combineHandlers(handlers));
  }

  delete(path, ...handlers) {
    this.addRoute("DELETE", path, this.combineHandlers(handlers));
  }

  patch(path, ...handlers) {
    this.addRoute("PATCH", path, this.combineHandlers(handlers));
  }

  route(req, res) {
    const { method, url } = req;
    const parsedUrl = new URL(url, `http://${req.headers.host}`);
    let pathname = parsedUrl.pathname;

    console.log(`[Router] Processing ${method} ${pathname}`);

    if (pathname.length > 1 && pathname.endsWith("/")) {
      pathname = pathname.slice(0, -1);
    }

    const applicableMiddleware = this.middleware
      .filter((mw) => pathname.startsWith(mw.path))
      .flatMap((mw) => mw.middleware);

    let currentMiddlewareIndex = 0;

    const executeNext = (err) => {
      if (err) {
        console.error("[Router] Middleware error:", err);
        if (!res.writableEnded) {
          return ResponseHandler.error(res, err.message, err.status || 500);
        }
        return;
      }

      if (currentMiddlewareIndex < applicableMiddleware.length) {
        const middleware = applicableMiddleware[currentMiddlewareIndex++];
        try {
          middleware(req, res, executeNext);
        } catch (error) {
          executeNext(error);
        }
      } else {
        // Find and execute route handler
        for (const route of this.routes) {
          const params = route.match(method, pathname);
          if (params) {
            console.log(
              `[Router] Executing handler for: ${method} ${pathname}`
            );
            req.params = params;
            req.query = Object.fromEntries(parsedUrl.searchParams);
            try {
              return route.handler(req, res);
            } catch (err) {
              console.error("[Router] Handler error:", err);
              if (!res.writableEnded) {
                ResponseHandler.error(res, err.message, err.status || 500);
              }
            }
            return; // Ensure we exit after calling the handler
          }
        }

        if (!res.writableEnded) {
          ResponseHandler.notFound(res, "Route not found");
        }
      }
    };

    executeNext();
  }

  logRoutes() {
    console.log("Registered routes:");
    this.routes.forEach((route) => {
      console.log(`${route.method} ${route.path}`);
    });
  }
}

module.exports = Router;
