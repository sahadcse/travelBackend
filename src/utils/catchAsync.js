const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      console.error("CatchAsync Error:", err);
      if (!res.writableEnded) {
        res.statusCode = err.status || 500;
        res.setHeader("Content-Type", "application/json");
        res.end(
          JSON.stringify({
            status: "error",
            message: err.message || "Internal Server Error",
          })
        );
      }
    });
  };
};

module.exports = { catchAsync };
