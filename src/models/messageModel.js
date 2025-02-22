const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender_id: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Sender ID is required"],
  },
  receiver_id: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Receiver ID is required"],
  },
  message: {
    type: String,
    required: [true, "Message is required"],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
