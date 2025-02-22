const User = require("../models/userModel");
const PasswordUtil = require("../utils/passwordUtil");

class UserService {
  static async createUser(userData) {
    const hashedPassword = await PasswordUtil.hash(userData.password);
    userData.password = hashedPassword;
    // userData.passwordConfirm = hashedPassword;

    const user = new User(userData);
    await user.save();

    // Remove sensitive data
    user.password = undefined;
    // user.passwordConfirm = undefined;
    return user;
  }

  static async getUsers(query = {}) {
    return User.find(query).select("-password");
  }

  static async getUserById(id) {
    return User.findById(id).select("-password");
  }

  static async updateUser(id, updateData) {
    if (updateData.password) {
      updateData.password = await PasswordUtil.hashPassword(updateData.password);
      // updateData.passwordConfirm = updateData.password;
    }

    return User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");
  }

  static async deleteUser(id) {
    return User.findByIdAndDelete(id);
  }

  static async findByEmail(email) {
    return User.findOne({ email }).select("+password");
  }

  static async validatePassword(user, password) {
    return PasswordUtil.verify(password, user.password);
  }
}

module.exports = UserService;
