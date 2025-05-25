const mongoose = require("mongoose");

const safeLocationSchema = new mongoose.Schema({
  universityName: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  lat: {
    type: Number,
    required: true,
  },
  lng: {
    type: Number,
    required: true,
  },
  radius: {
    type: Number, // Safe radius in meters
    required: true,
  },
});

module.exports = mongoose.model("SafeLocation", safeLocationSchema);
