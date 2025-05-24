const Listing = require("../Model/Listing");

// CREATE
exports.createListing = async (req, res) => {
  try {
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
    } = req.body;

    // Optionally, add image upload handling if using Multer
    const listing = new Listing({
      type,
      title,
      description,
      images,
      category,
      price,
      priceType,
      seller: req.user.id, // set by JWT auth middleware
      university: req.user.university,
      visibility,
      condition,
    });
    await listing.save();
    res.status(201).json(listing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ (single)
exports.getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate("seller", "name university email")
      .populate("offers.user", "name email");
    if (!listing)
      return res.status(404).json({ message: "Listing not found." });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ (all, with filters)
exports.getListings = async (req, res) => {
  try {
    const filter = {};
    // Filtering by query string
    if (req.query.category) filter.category = req.query.category;
    if (req.query.university) filter.university = req.query.university;
    if (req.query.type) filter.type = req.query.type;
    if (req.query.priceType) filter.priceType = req.query.priceType;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.seller) filter.seller = req.query.seller;
    if (req.query.visibility) filter.visibility = req.query.visibility;
    if (req.query.condition) filter.condition = req.query.condition;
    if (req.query.q) filter.title = { $regex: req.query.q, $options: "i" };

    // Price range filter (e.g., ?minPrice=10&maxPrice=200)
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
    }

    const listings = await Listing.find(filter)
      .sort({ createdAt: -1 })
      .populate("seller", "name university");
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE (owner or admin only)
exports.updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing)
      return res.status(404).json({ message: "Listing not found." });

    // Only owner or admin can update
    if (String(listing.seller) !== req.user.id && !req.user.isAdmin)
      return res.status(403).json({ message: "Not authorized." });

    // Only allow certain fields to be updated
    const updatableFields = [
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
    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) listing[field] = req.body[field];
    });

    await listing.save();
    res.json(listing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE (owner or admin only)
exports.deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing)
      return res.status(404).json({ message: "Listing not found." });

    if (String(listing.seller) !== req.user.id && !req.user.isAdmin)
      return res.status(403).json({ message: "Not authorized." });

    await listing.remove();
    res.json({ message: "Listing deleted." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ADD OFFER/BID
exports.addOffer = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing)
      return res.status(404).json({ message: "Listing not found." });

    if (listing.priceType !== "bidding")
      return res
        .status(400)
        .json({ message: "Offers allowed only on bidding listings." });

    // Prevent seller from bidding on own item
    if (String(listing.seller) === req.user.id)
      return res
        .status(400)
        .json({ message: "Cannot bid on your own listing." });

    const offer = {
      user: req.user.id,
      amount: req.body.amount,
    };
    listing.offers.push(offer);
    await listing.save();
    res.status(201).json(listing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CHANGE STATUS (e.g., sold/removed)
exports.changeStatus = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing)
      return res.status(404).json({ message: "Listing not found." });

    // Only seller or admin can change status
    if (String(listing.seller) !== req.user.id && !req.user.isAdmin)
      return res.status(403).json({ message: "Not authorized." });

    listing.status = req.body.status;
    await listing.save();
    res.json(listing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
