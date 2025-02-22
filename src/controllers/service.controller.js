const ServiceService = require("../services/service.service");
const AppError = require("../utils/AppError");
const { success } = require("../utils/http");

class ServiceController {
  constructor() {
    this.service = new ServiceService();

    // Bind all methods
    this.create = this.create.bind(this);
    this.getAll = this.getAll.bind(this);
    this.getOne = this.getOne.bind(this);
    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);
    this.search = this.search.bind(this);
  }

  sendResponse(res, status, data) {
    success(
      res,
      {
        results: Array.isArray(data) ? data.length : undefined,
        data,
      },
      status
    );
  }

  async create(req, res) {
    const service = await this.service.create({
      ...req.body,
      owner_id: req.user._id,
    });
    this.sendResponse(res, 201, { service });
  }

  async getAll(req, res) {
    const services = await this.service.getAll(req.query);
    this.sendResponse(res, 200, { services });
  }

  async getOne(req, res) {
    const service = await this.service.getById(req.params.id);
    if (!service) throw new AppError("Service not found", 404);
    this.sendResponse(res, 200, { service });
  }

  async update(req, res) {
    const service = await this.service.update(req.params.id, req.body);
    if (!service) throw new AppError("Service not found", 404);
    this.sendResponse(res, 200, { service });
  }

  async remove(req, res) {
    await this.service.delete(req.params.id);
    this.sendResponse(res, 204, null);
  }

  async search(req, res) {
    const services = await this.service.search(req.query);
    this.sendResponse(res, 200, { services });
  }
}

module.exports = ServiceController;
