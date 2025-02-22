/**
 * User Model Schema
 * Defines the structure and behavior of user documents
 */

const mongoose = require("mongoose");

/**
 * User Schema Definition
 * Includes personal info, authentication, preferences, and timestamps
 */
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true],
    },
    lastName: {
      type: String,
      required: [true],
    },
    email: {
      type: String,
      required: [true],
      unique: true, // This creates an index implicitly
      lowercase: true,
    },
    password: {
      type: String,
      required: [true],
      minlength: 8,
      select: false, // Do not send back password in query results
    },
    profilePicture: {
      type: String,
    },
    phone: {
      type: String,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    preferences: {
      language: {
        type: String,
        default: "en",
      },
      currency: {
        type: String,
        default: "BDT",
      },
      notifications: {
        email: {
          type: Boolean,
          default: true,
        },
        push: {
          type: Boolean,
          default: false,
        },
      },
    },
    role: {
      type: String,
      enum: ["customer", "provider", "admin"],
      default: "customer",
    },
    security: {
      passwordResetToken: String,
      passwordResetExpires: Date,
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
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

/**
 * Pre-save middleware to update timestamps
 */
userSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Create phone number index
userSchema.index({ phone: 1 });

const User = mongoose.model("User", userSchema);

module.exports = User;
