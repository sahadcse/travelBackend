const mongoose = require("mongoose");

const transportSchema = new mongoose.Schema(
  {
    provider_id: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Provider ID is required"],
    },
    vehicle_type: {
      type: String,
      enum: ["Car", "Bus", "Van", "Bike"],
      required: [true, "Vehicle type is required"],
    },
    model: {
      type: String,
      required: [true, "Model is required"],
    },
    license_plate: {
      type: String,
      required: [true, "License plate is required"],
    },
    trip_type: {
      type: String,
      enum: ["One-way", "Round-trip"],
      required: [true, "Trip type is required"],
    },
    capacity: {
      type: Number,
      required: [true, "Capacity is required"],
    },
    price_per_km: {
      type: Number,
      required: [true, "Price per KM is required"],
    },
    distance: {
      type: Number,
      required: [true, "Distance is required"],
    },
    pickup_location: {
      country: String,
      city: String,
      street: String,
    },
    dropoff_locations: [
      {
        city: String,
        price: Number,
      },
    ],
    pickup_time: {
      type: Date,
      required: [true, "Pickup time is required"],
    },
    available: {
      type: Boolean,
      default: true,
    },
    ratings: {
      average: {
        type: Number,
        default: 0,
      },
      total_reviews: {
        type: Number,
        default: 0,
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: Date,
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

// Document middleware to set the updatedAt field on save
transportSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const Transport = mongoose.model("Transport", transportSchema);

module.exports = Transport;
