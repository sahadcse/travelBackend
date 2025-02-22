class ResponseHandler {
  static success(res, data, statusCode = 200) {
    res.statusCode = statusCode;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        status: "success",
        data,
      })
    );
  }

  static error(res, message, statusCode = 400) {
    res.statusCode = statusCode;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        status: "error",
        message,
      })
    );
  }

  static notFound(res, message = "Not found") {
    return this.error(res, message, 404);
  }
}

module.exports = ResponseHandler;
