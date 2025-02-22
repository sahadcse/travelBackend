const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "User ID is required"],
  },
  listing_id: {
    type: mongoose.Schema.ObjectId,
    ref: "Service",
    required: [true, "Listing ID is required"],
  },
  check_in: {
    type: Date,
    required: [true, "Check-in date is required"],
  },
  check_out: {
    type: Date,
    required: [true, "Check-out date is required"],
  },
  guests: {
    type: Number,
    required: [true, "Number of guests is required"],
  },
  total_price: {
    type: Number,
    required: [true, "Total price is required"],
  },
  payment_status: {
    type: String,
    enum: ["pending", "completed", "cancelled"],
    default: "pending",
  },
  booking_status: {
    type: String,
    enum: ["confirmed", "cancelled", "pending"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

bookingSchema.index({ user_id: 1 });
bookingSchema.index({ listing_id: 1 });
bookingSchema.index({ check_in: 1 });
bookingSchema.index({ check_out: 1 });

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
