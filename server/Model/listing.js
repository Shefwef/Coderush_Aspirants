const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const listingSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["item", "service"], required: true },
    title: { type: String, required: true },
    description: { type: String },
    images: [{ type: String }], // URLs or filepaths
    category: { type: String, required: true },
    price: { type: Number, required: true },
    priceType: {
      type: String,
      enum: ["fixed", "bidding", "hourly"],
      default: "fixed",
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    visibility: {
      type: String,
      enum: ["university", "all"],
      default: "university",
    },
    university: { type: String, required: true },
    condition: {
      type: String,
      enum: ["like new", "good", "fair"],
      default: "good",
    },
    status: {
      type: String,
      enum: ["active", "sold", "removed"],
      default: "active",
    },
    offers: [offerSchema], // For bidding type
  },
  { timestamps: true }
);

module.exports = mongoose.model("Listing", listingSchema);
