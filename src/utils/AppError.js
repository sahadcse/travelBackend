function AppError(message, statusCode) {
  Error.call(this, message);

  this.message = message;
  this.statusCode = statusCode;
  this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
  this.isOperational = true;

  Error.captureStackTrace(this, AppError);
}

AppError.prototype = Object.create(Error.prototype);
AppError.prototype.constructor = AppError;

module.exports = AppError;
