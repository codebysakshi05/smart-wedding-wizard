/**
 * models/WeddingPlan.js
 *
 * Mongoose schema for saving generated wedding plans.
 */

const mongoose = require("mongoose");

const weddingPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    budget: {
      type: Number,
      required: true,
    },
    guests: {
      type: Number,
      required: true,
    },
    theme: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    options: {
      // The fully parsed AI response containing 3 variations
      type: [Object],
      required: true,
    },
    images: {
      // URLs of the generated images
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  },
);

const WeddingPlan = mongoose.model("WeddingPlan", weddingPlanSchema);

module.exports = WeddingPlan;
