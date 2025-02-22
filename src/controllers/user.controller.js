const UserService = require("../services/user.service");
const ResponseHandler = require("../utils/ResponseHandler");
const mongoose = require("mongoose");

class UserController {
  constructor() {
    // Bind all methods to this instance
    this.getAllUsers = this.getAllUsers.bind(this);
    this.getUserById = this.getUserById.bind(this);
    this.createUser = this.createUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }

  async getAllUsers(req, res) {
    try {
      console.log("Getting all users - controller start");
      const users = await UserService.getUsers();
      console.log("Users fetched:", users ? users.length : 0);

      if (!res.writableEnded) {
        return ResponseHandler.success(res, { users });
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getUserById(req, res) {
    try {
      let { id } = req.params;
      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return ResponseHandler.error(res, "Invalid user id-Controller", 400);
      }
      if (req.user.role !== 'admin') {
        id = req.user._id;
      }
      const user = await UserService.getUserById(id);
      if (!user) return ResponseHandler.notFound(res, "User not found");
      ResponseHandler.success(res, user);
    } catch (error) {
      this.handleError(res, error, "User not found");
    }
  }

  async createUser(req, res) {
    try {
      const userData = await this.parseRequestBody(req);
      const user = await UserService.createUser(userData);
      ResponseHandler.success(res, user, 201);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async updateUser(req, res) {
    try {
      const id = req.url.split("/")[2];
      const updateData = await this.parseRequestBody(req);
      const user = await UserService.updateUser(id, updateData);
      if (!user) return ResponseHandler.notFound(res, "User not found");
      ResponseHandler.success(res, user);
    } catch (error) {
      this.handleError(res, error, "User not found");
    }
  }

  async deleteUser(req, res) {
    try {
      const id = req.url.split("/")[2];
      const user = await UserService.deleteUser(id);
      if (!user) return ResponseHandler.notFound(res, "User not found");
      ResponseHandler.success(res, null, 204);
    } catch (error) {
      this.handleError(res, error, "User not found");
    }
  }

  handleError(res, error, message = "An error occurred") {
    console.error("Controller error:", error);
    return ResponseHandler.error(res, message, error.status || 500);
  }

  parseRequestBody(req) {
    return new Promise((resolve, reject) => {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        try {
          resolve(JSON.parse(body));
        } catch (error) {
          reject(new Error("Invalid request body"));
        }
      });
      req.on("error", reject);
    });
  }
}

module.exports = UserController;
