const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    service_id: {
      type: mongoose.Schema.ObjectId,
      required: [true, "Service ID is required"],
    },
    service_type: {
      type: String,
      enum: ["listing", "transport"],
      required: [true, "Service type is required"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Rating is required"],
    },
    review_text: {
      type: String,
      required: [true, "Review text is required"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user_id",
    select: "firstName lastName profilePicture",
  });
  next();
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
