/**
 * models/SavedPlan.js
 *
 * Mongoose schema for users to explicitly save their favorite wedding plans.
 */

const mongoose = require("mongoose");

const savedPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    plan: {
      // The specific variation details (venue, decor, catering, etc.)
      type: Object,
      required: true,
    },
    budget: {
      type: Number,
      required: true,
    },
    theme: {
      type: String,
      required: true,
    },
    guests: {
      type: Number,
      required: true,
    },
    images: {
      // URLs of the images associated with this plan
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  },
);

const SavedPlan = mongoose.model("SavedPlan", savedPlanSchema);

module.exports = SavedPlan;
