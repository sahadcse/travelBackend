const Transport = require("../models/transportModel");
const APIFeatures = require("../utils/APIFeatures");

const createTransport = async (data) => {
  return await Transport.create(data);
};

const getAllTransports = async (query) => {
  return await new APIFeatures(Transport.find(), query)
    .filter()
    .sort()
    .paginate().query;
};

const getTransportById = async (id) => {
  return await Transport.findById(id);
};

const updateTransport = async (id, data) => {
  return await Transport.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

const deleteTransport = async (id) => {
  return await Transport.findByIdAndDelete(id);
};

const searchTransports = async (filters) => {
  const query = buildSearchQuery(filters);
  return await Transport.find(query);
};

const buildSearchQuery = (filters) => {
  const query = {};

  if (filters.vehicle_type) query.vehicle_type = filters.vehicle_type;
  if (filters.trip_type) query.trip_type = filters.trip_type;
  if (filters.city)
    query["pickup_location.city"] = new RegExp(filters.city, "i");
  if (filters.minPrice || filters.maxPrice) {
    query.price_per_km = {};
    if (filters.minPrice) query.price_per_km.$gte = Number(filters.minPrice);
    if (filters.maxPrice) query.price_per_km.$lte = Number(filters.maxPrice);
  }
  if (filters.capacity) query.capacity = { $gte: Number(filters.capacity) };
  if (filters.available !== undefined) query.available = filters.available;

  return query;
};

module.exports = {
  createTransport,
  getAllTransports,
  getTransportById,
  updateTransport,
  deleteTransport,
  searchTransports,
};
