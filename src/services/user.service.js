const User = require("../models/userModel");
const PasswordUtil = require("../utils/passwordUtil");

const createUser = async (userData) => {
  const hashedPassword = await PasswordUtil.hash(userData.password);
  userData.password = hashedPassword;

  const user = await User.create(userData);
  user.password = undefined;
  return user;
};

const getUsers = async (query = {}) => {
  return await User.find(query).select("-password");
};

const getUserById = async (id) => {
  return await User.findById(id).select("-password");
};

const updateUser = async (id, updateData) => {
  if (updateData.password) {
    updateData.password = await PasswordUtil.hash(updateData.password);
  }

  return await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).select("-password");
};

const deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};

const findByEmail = async (email) => {
  return await User.findOne({ email }).select("+password");
};

const validatePassword = async (user, password) => {
  return await PasswordUtil.verify(password, user.password);
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  findByEmail,
  validatePassword,
};
