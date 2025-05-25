const express = require("express");
const SafeLocation = require("../Model/SafeLocationModel");
const router = express.Router();

// Haversine Formula (to calculate the distance between two points on Earth)
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

// Endpoint to check if a location is safe
router.post("/check-safety", async (req, res) => {
  const { universityName, lat, lng } = req.body;

  try {
    // Get safe locations for the university
    const safeLocations = await SafeLocation.find({ universityName });

    for (let location of safeLocations) {
      // Calculate the distance between selected location and the safe location
      const distance = haversineDistance(lat, lng, location.lat, location.lng);

      if (distance <= location.radius) {
        return res.json({ status: "Safe", location: location.name });
      }
    }

    return res.json({ status: "Unsafe" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
