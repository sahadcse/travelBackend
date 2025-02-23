const Booking = require("../models/bookingModel");
const Service = require("../models/serviceModel");
const APIFeatures = require("../utils/APIFeatures");

const createBooking = async (bookingData) => {
  const service = await Service.findById(bookingData.listing_id);
  if (!service) {
    throw new Error("Service not found");
  }

  const isAvailable = await checkAvailability(
    bookingData.listing_id,
    bookingData.check_in,
    bookingData.check_out
  );
  if (!isAvailable) {
    throw new Error("Service not available for these dates");
  }

  const nights = Math.ceil(
    (new Date(bookingData.check_out) - new Date(bookingData.check_in)) /
      (1000 * 60 * 60 * 24)
  );
  bookingData.total_price = service.price_per_night * nights;

  return await Booking.create(bookingData);
};

const getUserBookings = async (userId) => {
  return await Booking.find({ user_id: userId })
    .populate("listing_id")
    .sort("-createdAt");
};

const getAllBookings = async (query) => {
  return await new APIFeatures(
    Booking.find().populate("listing_id user_id"),
    query
  )
    .filter()
    .sort()
    .paginate().query;
};

const cancelBooking = async (bookingId, userId) => {
  const booking = await Booking.findOne({
    _id: bookingId,
    user_id: userId,
    booking_status: { $ne: "cancelled" },
  });

  if (!booking) return null;

  booking.booking_status = "cancelled";
  booking.payment_status = "cancelled";
  return await booking.save();
};

const updateBookingStatus = async (bookingId, status) => {
  return await Booking.findByIdAndUpdate(
    bookingId,
    { booking_status: status },
    { new: true, runValidators: true }
  );
};

const deleteBooking = async (bookingId) => {
  return await Booking.findByIdAndDelete(bookingId);
};

const checkAvailability = async (listingId, checkIn, checkOut) => {
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
};

module.exports = {
  createBooking,
  getUserBookings,
  getAllBookings,
  cancelBooking,
  updateBookingStatus,
  deleteBooking,
  checkAvailability,
};
