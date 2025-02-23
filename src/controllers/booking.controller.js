const {
  createBooking,
  getUserBookings,
  getAllBookings,
  cancelBooking: cancelBookingService,
  updateBookingStatus,
  deleteBooking: removeBooking,
} = require("../services/booking.service");

const create = async (req, res) => {
  try {
    const booking = await createBooking({
      ...req.body,
      user_id: req.user._id,
    });
    res.status(201).json({
      success: true,
      data: { booking },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error creating booking",
    });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await getUserBookings(req.user._id);
    res.status(200).json({
      success: true,
      results: bookings.length,
      data: { bookings },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching bookings",
    });
  }
};

const getAll = async (req, res) => {
  try {
    const bookings = await getAllBookings(req.query);
    res.status(200).json({
      success: true,
      results: bookings.length,
      data: { bookings },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching all bookings",
    });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const booking = await cancelBookingService(req.params.id, req.user._id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found or already cancelled",
      });
    }
    res.status(200).json({
      success: true,
      data: { booking },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error cancelling booking",
    });
  }
};

const updateStatus = async (req, res) => {
  try {
    const booking = await updateBookingStatus(req.params.id, req.body.status);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }
    res.status(200).json({
      success: true,
      data: { booking },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error updating booking status",
    });
  }
};

const deleteBooking = async (req, res) => {
  try {
    await removeBooking(req.params.id);
    res.status(204).json({
      success: true,
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error deleting booking",
    });
  }
};

module.exports = {
  create,
  getMyBookings,
  getAll,
  cancelBooking,
  updateStatus,
  deleteBooking,
};
