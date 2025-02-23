const Service = require("../models/serviceModel");
const APIFeatures = require("../utils/APIFeatures");

const createService = async (data) => {
  return await Service.create(data);
};

const getAllServices = async (query) => {
  return await new APIFeatures(Service.find(), query).filter().sort().paginate()
    .query;
};

const getServiceById = async (id) => {
  return await Service.findById(id);
};

const updateService = async (id, data) => {
  return await Service.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

const deleteService = async (id) => {
  return await Service.findByIdAndDelete(id);
};

const searchServices = async (filters) => {
  const searchQuery = buildSearchQuery(filters);
  return await Service.find(searchQuery);
};

const buildSearchQuery = (filters) => {
  const query = {};

  if (filters.type) query.type = filters.type;
  if (filters.city) query["location.city"] = new RegExp(filters.city, "i");
  if (filters.minPrice || filters.maxPrice) {
    query.price_per_night = {};
    if (filters.minPrice) query.price_per_night.$gte = Number(filters.minPrice);
    if (filters.maxPrice) query.price_per_night.$lte = Number(filters.maxPrice);
  }
  if (filters.guests) query.max_guests = { $gte: Number(filters.guests) };

  return query;
};

module.exports = {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
  searchServices,
};
