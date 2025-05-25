const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing", // Refers to the Listing model
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "passive", "sent", "delivered", "blocked"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
