const http = require("http");
require("dotenv").config();

const app = http.createServer();

const middlewares = [];

app.use = (middleware) => {
  middlewares.push(middleware);
};

const parseRequestMiddleware = require("../middleware/parseRequest.middleware");

app.use(parseRequestMiddleware);

// Custom emit function to handle middleware and routing
app.route = (router) => {
  app.on("request", (req, res) => {
    let index = 0;
    const next = (err) => {
      if (err) {
        // Handle errors passed down the middleware chain
        return handleAppError(err, req, res);
      }

      if (index < middlewares.length) {
        const middleware = middlewares[index++];
        middleware(req, res, next);
      } else {
        // Execute the router when all middleware have been processed
        router(req, res);
      }
    };

    next(); // Start the middleware chain
  });
};

function handleAppError(err, req, res) {
  console.error("App error:", err);
  res.statusCode = err.statusCode || 500;
  res.setHeader("Content-Type", "application/json");
  res.end(
    JSON.stringify({
      message: err.message || "Internal Server Error",
      error: err,
    })
  );
}

module.exports = app;
