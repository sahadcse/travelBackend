const BookingService = require("../services/booking.service");
const AppError = require("../utils/AppError");
const { success } = require("../utils/http");

class BookingController {
  constructor() {
    this.service = new BookingService();

    // Bind all methods
    this.create = this.create.bind(this);
    this.getMyBookings = this.getMyBookings.bind(this);
    this.getAll = this.getAll.bind(this);
    this.cancelBooking = this.cancelBooking.bind(this);
    this.updateStatus = this.updateStatus.bind(this);
    this.remove = this.remove.bind(this);
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
    const booking = await this.service.createBooking({
      ...req.body,
      user_id: req.user._id,
    });
    this.sendResponse(res, 201, { booking });
  }

  async getMyBookings(req, res) {
    const bookings = await this.service.getUserBookings(req.user._id);
    this.sendResponse(res, 200, { bookings });
  }

  async getAll(req, res) {
    const bookings = await this.service.getAllBookings(req.query);
    this.sendResponse(res, 200, { bookings });
  }

  async cancelBooking(req, res) {
    const booking = await this.service.cancelBooking(
      req.params.id,
      req.user._id
    );
    if (!booking) throw new AppError("Booking not found", 404);
    this.sendResponse(res, 200, { booking });
  }

  async updateStatus(req, res) {
    const booking = await this.service.updateBookingStatus(
      req.params.id,
      req.body.status
    );
    if (!booking) throw new AppError("Booking not found", 404);
    this.sendResponse(res, 200, { booking });
  }

  async remove(req, res) {
    await this.service.deleteBooking(req.params.id);
    this.sendResponse(res, 204, null);
  }
}

module.exports = BookingController;
