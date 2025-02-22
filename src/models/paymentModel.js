const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  booking_id: {
    type: mongoose.Schema.ObjectId,
    ref: "Booking",
    required: [true, "Booking ID is required"],
  },
  user_id: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "User ID is required"],
  },
  amount: {
    type: Number,
    required: [true, "Amount is required"],
  },
  currency: {
    type: String,
    default: "BDT",
  },
  payment_method: {
    type: String,
    enum: ["credit_card", "bank_transfer"],
    required: [true, "Payment method is required"],
  },
  transaction_id: {
    type: String,
  },
  payment_status: {
    type: String,
    enum: ["success", "failed", "pending"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

paymentSchema.index({ transaction_id: 1 });
paymentSchema.index({ payment_status: 1 });

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
