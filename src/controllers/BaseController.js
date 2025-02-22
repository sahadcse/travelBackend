const ResponseHandler = require("../utils/ResponseHandler");
const { parseBody } = require("../utils/http");

/**
 * Base controller class providing common functionality for all controllers
 */
class BaseController {
  /**
   * Parses and validates the request body
   * @param {Request} req - request object
   * @returns {Promise<Object>} Parsed request body
   * @throws {Error} If request body is invalid
   */
  static async parseRequestBody(req) {
    try {
      return await parseBody(req);
    } catch (error) {
      throw new Error("Invalid request body");
    }
  }

  /**
   * Handles errors and sends appropriate response
   * @param {Response} res - Express response object
   * @param {Error} error - Error object to handle
   * @param {string|null} notFoundMsg - Optional message to check for not found errors
   */
  static handleError(res, error, notFoundMsg = null) {
    console.error(`[${this.name}] Error:`, error);
    if (notFoundMsg && error.message.includes(notFoundMsg)) {
      ResponseHandler.notFound(res, error.message);
    } else if (error.name === "ValidationError") {
      ResponseHandler.error(res, error, 400);
    } else {
      ResponseHandler.error(res, error, error.statusCode || 500);
    }
  }
}

module.exports = BaseController;
