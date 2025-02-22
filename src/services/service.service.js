const Service = require("../models/serviceModel");
const APIFeatures = require("../utils/APIFeatures");

class ServiceService {
  async create(data) {
    return await Service.create(data);
  }

  async getAll(query) {
    return await new APIFeatures(Service.find(), query)
      .filter()
      .sort()
      .paginate().query;
  }

  async getById(id) {
    return await Service.findById(id);
  }

  async update(id, data) {
    return await Service.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id) {
    return await Service.findByIdAndDelete(id);
  }

  async search(filters) {
    const searchQuery = this.buildSearchQuery(filters);
    return await Service.find(searchQuery);
  }

  buildSearchQuery(filters) {
    const query = {};

    if (filters.type) query.type = filters.type;
    if (filters.city) query["location.city"] = new RegExp(filters.city, "i");
    if (filters.minPrice || filters.maxPrice) {
      query.price_per_night = {};
      if (filters.minPrice)
        query.price_per_night.$gte = Number(filters.minPrice);
      if (filters.maxPrice)
        query.price_per_night.$lte = Number(filters.maxPrice);
    }
    if (filters.guests) query.max_guests = { $gte: Number(filters.guests) };

    return query;
  }
}

module.exports = ServiceService;
