/**
 * models/Venue.js
 *
 * Mongoose schema for wedding venues.
 */

const mongoose = require("mongoose");

const venueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["banquet", "beach", "garden", "resort", "hotel"],
      required: true,
    },
    priceRange: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    },
    capacity: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 4.5,
    },
    address: {
      type: String,
      required: true,
    },
    amenities: [String],
  },
  {
    timestamps: true,
  },
);

const Venue = mongoose.model("Venue", venueSchema);

module.exports = Venue;
