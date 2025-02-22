const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema({
  start_date: Date,
  end_date: Date,
});

const locationSchema = new mongoose.Schema({
  country: String,
  city: String,
  street: String,
  latitude: Number,
  longitude: Number,
});

const ratingsSchema = new mongoose.Schema({
  average: { type: Number, default: 0 },
  total_reviews: { type: Number, default: 0 },
});

const serviceSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["apartment", "hotel", "resort", "shared_room", "convention_hall"],
      required: [true, "Service type is required"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    owner_id: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Owner ID is required"],
    },
    location: locationSchema,
    amenities: [String],
    price_per_night: {
      type: Number,
      required: [true, "Price per night is required"],
    },
    max_guests: {
      type: Number,
      required: [true, "Maximum guests is required"],
    },
    bedrooms: Number,
    bathrooms: Number,
    images: [String],
    ratings: ratingsSchema,
    availability: [availabilitySchema],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
serviceSchema.index({ "location.city": 1, type: 1, price_per_night: 1 });

module.exports = mongoose.model("Service", serviceSchema);
