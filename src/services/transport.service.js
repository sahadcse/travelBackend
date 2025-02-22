const Transport = require("../models/transportModel");
const APIFeatures = require("../utils/APIFeatures");

class TransportService {
  async create(data) {
    return await Transport.create(data);
  }

  async getAll(query) {
    return await new APIFeatures(Transport.find(), query)
      .filter()
      .sort()
      .paginate().query;
  }

  async getById(id) {
    return await Transport.findById(id);
  }

  async update(id, data) {
    return await Transport.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id) {
    return await Transport.findByIdAndDelete(id);
  }

  async search(filters) {
    const query = this.buildSearchQuery(filters);
    return await Transport.find(query);
  }

  buildSearchQuery(filters) {
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
  }
}

module.exports = TransportService;
