// controllers/ListingController.js
const Listing = require("../Model/listing.model");
const User = require("../Model/user.model");
// In ListingController.js
const { Groq } = require("groq-sdk");
const groqClient = new Groq({
  apiKey: process.env.GROQ_API,
  dangerouslyAllowBrowser: false, // Ensure server-side only
});

exports.predictPriceWithGroq = async (req, res) => {
  try {
    const { category, condition } = req.body;

    // Validate the inputs
    if (!category || !condition) {
      return res
        .status(400)
        .json({ message: "Category and condition are required." });
    }

    // Call Groq's API for price prediction
    const groqResponse = await groqClient.chat.completions.create({
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Predict price based on category: ${category} and condition: ${condition}. Just return a number`,
            },
          ],
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 1,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: false,
      stop: null,
    });

    // Extract the predicted price
    const predictedPrice = groqResponse.choices[0]?.message?.content?.trim();
    if (!predictedPrice) {
      return res.status(500).json({ message: "Error predicting price" });
    }

    res.status(200).json({ predictedPrice });
  } catch (err) {
    console.error("Error predicting price with Groq:", err);
    res.status(500).json({ message: "Failed to predict price." });
  }
};

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

exports.getListings = async (req, res) => {
  try {
    const { userId } = req.params; // Get the userId from the URL
    const { q, category, minPrice, maxPrice } = req.query; // Get the query parameters

    // Find user to get university and email
    const user = await User.findById(userId).select("university email");
    if (!user) return res.status(404).json({ message: "User not found." });

    const userUniversity = user.university;
    const userEmail = user.email; // Extract the user's email

    // Build filters
    const filter = {
      $or: [
        { visibility: "all" },
        { visibility: "university", university: userUniversity },
      ],
    };

    // Exclude listings where the seller's email matches the user's email
    filter.$and = filter.$and || [];
    filter.$and.push({ sellerEmail: { $ne: userEmail } }); // Exclude listings with the user's email as the seller's email

    // Apply search, category, min/max price filters
    if (q) {
      filter.$and.push({
        $or: [{ title: new RegExp(q, "i") }, { category: new RegExp(q, "i") }],
      });
    }

    if (category) {
      filter.$and.push({ category });
    }

    if (minPrice) {
      filter.$and.push({ price: { $gte: Number(minPrice) } });
    }

    if (maxPrice) {
      filter.$and.push({ price: { $lte: Number(maxPrice) } });
    }

    // Find listings based on the filter
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
const Chat = require("../Model/Chat");
exports.createChat = async (req, res) => {
  try {
    const { userId } = req.params; // Extract the current user's ID (buyer) from the URL
    const { listingId, status } = req.body; // Extract listingId and status from the request body

    // Find the current user (buyer) using userId from the URL
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the listing using the listingId from the body
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    // Get the seller's email from the listing
    const sellerEmail = listing.seller; // The seller's email is stored in the listing

    // Find the seller's user ID using the sellerEmail
    const seller = await User.findOne({ email: sellerEmail });
    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    // Create a new chat between the buyer and the seller
    const chat = new Chat({
      buyerId: currentUser._id, // Set the buyer's ID
      sellerId: seller._id, // Set the seller's ID
      productId: listing._id, // Set the listing's ID as the productId
      status: status, // Set the chat's status (active, etc.)
    });

    await chat.save(); // Save the chat to the database

    // Respond with the created chat details
    res.status(200).json({
      chat: {
        _id: chat._id,
        buyerId: chat.buyerId,
        sellerId: chat.sellerId,
        productId: chat.productId,
        status: chat.status,
      },
    });
  } catch (err) {
    console.error("❌ createChat error:", err);
    res.status(500).json({ error: "Error creating chat." });
  }
};
