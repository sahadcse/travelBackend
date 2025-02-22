const parseRequestData = require("../utils/requestParser");

function parseRequestMiddleware(req, res, next) {
  parseRequestData(req)
    .then((body) => {
      req.body = body;
      next();
    })
    .catch((err) => {
      console.error("Error parsing request data:", err);
      res.statusCode = 400;
      res.end(JSON.stringify({ message: "Invalid JSON data." }));
    });
}

module.exports = parseRequestMiddleware;
