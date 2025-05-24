const express = require("express");
const router = express.Router();
const ListingController = require("../Controller/ListingController");
const { createListing, updateListing, deleteListing } = ListingController;

const { verifyToken } = require("../middleware/jwt"); // <-- You must have a JWT middleware

// Public
router.get("/", ListingController.getListings);
router.get("/:id", ListingController.getListingById);

// Protected (must be logged in)
router.post("/", verifyToken, createListing);
router.patch("/:id", verifyToken, updateListing);
router.delete("/:id", verifyToken, deleteListing);

// Bidding/Offers
router.post("/:id/offer", verifyToken, ListingController.addOffer);

// Change status (sold/removed)
router.patch("/:id/status", verifyToken, ListingController.changeStatus);

module.exports = router;
