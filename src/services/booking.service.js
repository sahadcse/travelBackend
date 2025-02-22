const Booking = require("../models/bookingModel");
const Service = require("../models/serviceModel");
const AppError = require("../utils/AppError");
const APIFeatures = require("../utils/APIFeatures");

class BookingService {
  async createBooking(bookingData) {
    // Validate listing availability
    const service = await Service.findById(bookingData.listing_id);
    if (!service) throw new AppError("Service not found", 404);

    // Check if dates are available
    const isAvailable = await this.checkAvailability(
      bookingData.listing_id,
      bookingData.check_in,
      bookingData.check_out
    );
    if (!isAvailable)
      throw new AppError("Service not available for these dates", 400);

    // Calculate total price
    const nights = Math.ceil(
      (new Date(bookingData.check_out) - new Date(bookingData.check_in)) /
        (1000 * 60 * 60 * 24)
    );
    bookingData.total_price = service.price_per_night * nights;

    return await Booking.create(bookingData);
  }

  async getUserBookings(userId) {
    return await Booking.find({ user_id: userId })
      .populate("listing_id")
      .sort("-createdAt");
  }

  async getAllBookings(query) {
    return await new APIFeatures(
      Booking.find().populate("listing_id user_id"),
      query
    )
      .filter()
      .sort()
      .paginate().query;
  }

  async cancelBooking(bookingId, userId) {
    const booking = await Booking.findOne({
      _id: bookingId,
      user_id: userId,
      booking_status: { $ne: "cancelled" },
    });

    if (!booking) return null;

    booking.booking_status = "cancelled";
    booking.payment_status = "cancelled";
    return await booking.save();
  }

  async updateBookingStatus(bookingId, status) {
    return await Booking.findByIdAndUpdate(
      bookingId,
      { booking_status: status },
      { new: true, runValidators: true }
    );
  }

  async deleteBooking(bookingId) {
    return await Booking.findByIdAndDelete(bookingId);
  }

  async checkAvailability(listingId, checkIn, checkOut) {
    const conflictingBookings = await Booking.countDocuments({
      listing_id: listingId,
      booking_status: { $ne: "cancelled" },
      $or: [
        {
          check_in: { $lte: checkOut },
          check_out: { $gte: checkIn },
        },
      ],
    });

    return conflictingBookings === 0;
  }
}

module.exports = BookingService;
