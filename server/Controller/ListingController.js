// controllers/ListingController.js
const Listing = require("../Model/listing.model");
const User = require("../Model/user.model");

exports.createListing = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find user by userId param
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    const {
      type,
      title,
      description,
      images,
      category,
      price,
      priceType,
      visibility,
      condition,
      biddingEndDate,
      minBidIncrement,
    } = req.body;

    if (!images?.length) {
      return res
        .status(400)
        .json({ message: "At least one image is required." });
    }

    if (priceType === "bidding" && (!biddingEndDate || !minBidIncrement)) {
      return res.status(400).json({
        message: "Bidding end-date and minimum increment are required.",
      });
    }

    const listing = new Listing({
      type,
      title,
      description,
      images,
      category,
      price,
      priceType,
      seller: user.email, // get email from DB user
      university: user.university, // get university from DB user
      visibility,
      condition,
      ...(priceType === "bidding" && {
        biddingEndDate: new Date(biddingEndDate),
        minBidIncrement,
      }),
    });

    await listing.save();
    res.status(201).json(listing);
  } catch (err) {
    console.error("❌ createListing error:", err);
    res.status(500).json({ message: err.message });
  }
};
// READ single
exports.getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate(
      "offers.user",
      "username email"
    );
    if (!listing)
      return res.status(404).json({ message: "Listing not found." });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ all
// READ all listings - simple version (no filters)
exports.getListings = async (req, res) => {
  try {
    const { userId } = req.params;
    const { q, category, minPrice, maxPrice } = req.query;

    // Find user to get university
    const user = await User.findById(userId).select("university");
    if (!user) return res.status(404).json({ message: "User not found." });

    const userUniversity = user.university;

    // Build filters
    const filter = {
      $or: [
        { visibility: "all" },
        { visibility: "university", university: userUniversity },
      ],
    };

    if (q) {
      filter.$and = filter.$and || [];
      filter.$and.push({
        $or: [{ title: new RegExp(q, "i") }, { category: new RegExp(q, "i") }],
      });
    }

    if (category) {
      filter.$and = filter.$and || [];
      filter.$and.push({ category });
    }

    if (minPrice) {
      filter.$and = filter.$and || [];
      filter.$and.push({ price: { $gte: Number(minPrice) } });
    }

    if (maxPrice) {
      filter.$and = filter.$and || [];
      filter.$and.push({ price: { $lte: Number(maxPrice) } });
    }

    const listings = await Listing.find(filter)
      .sort({ createdAt: -1 })
      .populate("offers.user", "username email");

    res.json(listings);
  } catch (err) {
    console.error("❌ getListings error:", err);
    res.status(500).json({ message: "Failed to get listings." });
  }
};

// UPDATE (owner or admin)
exports.updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing)
      return res.status(404).json({ message: "Listing not found." });

    // ← compare email
    if (listing.seller !== req.user.email && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized." });
    }

    const updatable = [
      "title",
      "description",
      "images",
      "category",
      "price",
      "priceType",
      "visibility",
      "condition",
      "status",
    ];
    updatable.forEach((field) => {
      if (req.body[field] !== undefined) listing[field] = req.body[field];
    });

    await listing.save();
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE (owner or admin)
exports.deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing)
      return res.status(404).json({ message: "Listing not found." });

    if (listing.seller !== req.user.email && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized." });
    }

    await listing.remove();
    res.json({ message: "Listing deleted." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADD OFFER/BID
exports.addOffer = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing)
      return res.status(404).json({ message: "Listing not found." });
    if (listing.priceType !== "bidding") {
      return res
        .status(400)
        .json({ message: "Offers allowed only on bidding listings." });
    }
    // ← compare email
    if (listing.seller === req.user.email) {
      return res
        .status(400)
        .json({ message: "Cannot bid on your own listing." });
    }

    listing.offers.push({
      user: req.user.id, // assuming your JWT payload has `id`
      amount: req.body.amount,
    });
    await listing.save();
    res.status(201).json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CHANGE STATUS
exports.changeStatus = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing)
      return res.status(404).json({ message: "Listing not found." });
    if (listing.seller !== req.user.email && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized." });
    }
    listing.status = req.body.status;
    await listing.save();
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
