const TransportService = require("../services/transport.service");
const AppError = require("../utils/AppError");
const { success } = require("../utils/http");

class TransportController {
  constructor() {
    this.service = new TransportService();

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
    const transport = await this.service.create({
      ...req.body,
      owner_id: req.user._id,
    });
    this.sendResponse(res, 201, { transport });
  }

  async getAll(req, res) {
    const transports = await this.service.getAll(req.query);
    this.sendResponse(res, 200, { transports });
  }

  async getOne(req, res) {
    const transport = await this.service.getById(req.params.id);
    if (!transport) throw new AppError("Transport not found", 404);
    this.sendResponse(res, 200, { transport });
  }

  async update(req, res) {
    const transport = await this.service.update(req.params.id, req.body);
    if (!transport) throw new AppError("Transport not found", 404);
    this.sendResponse(res, 200, { transport });
  }

  async remove(req, res) {
    await this.service.delete(req.params.id);
    this.sendResponse(res, 204, null);
  }

  async search(req, res) {
    const transports = await this.service.search(req.query);
    this.sendResponse(res, 200, { transports });
  }
}

module.exports = TransportController;
