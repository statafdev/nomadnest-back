const Listing = require("../models/Listing");
const User = require("../models/User");

// ========== PUBLIC ENDPOINTS ==========

// GET /api/listings - Get all listings (with optional filters)
exports.getAllListings = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, location, minGuests } = req.query;

    // Build filter object
    let filter = { isAvailable: true };

    if (category) {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    if (minGuests) {
      filter.maxGuests = { $gte: Number(minGuests) };
    }

    // Fetch listings with owner info
    const listings = await Listing.find(filter)
      .populate("owner", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      count: listings.length,
      data: listings,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// GET /api/listings/:id - Get single listing
exports.getListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate(
      "owner",
      "username email"
    );

    if (!listing) {
      return res.status(404).json({
        status: "error",
        message: "Listing not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: listing,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// ========== PRIVATE USER ENDPOINTS ==========

// POST /api/listings - Create listing (requires token)
exports.createListing = async (req, res) => {
  console.log(req.body);
  try {
    const { title, description, location, price, images, owner } = req.body;

    // Validation
    if (
      !title ||
      !description ||
      !location ||
      !price ||
      !owner ||
    ) {
      return res.status(400).json({
        status: "error",
        message: "Please provide all required fields",
      });
    }

    // Create listing with owner as current user
    const listing = await Listing.create({
      title,
      description,
      location,
      price,
      images: images || [],
      owner: req.user.id,
    });

    // Populate owner info before returning
    await listing.populate("owner", "username email");

    res.status(201).json({
      status: "success",
      message: "Listing created successfully",
      data: listing,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// PUT /api/listings/:id - Update listing (owner only)
exports.updateListing = async (req, res) => {
  try {
    let listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        status: "error",
        message: "Listing not found",
      });
    }

    // Check if user is the owner
    if (listing.owner.toString() !== req.user.id) {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to update this listing",
      });
    }

    // Update listing
    listing = await Listing.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("owner", "username email");

    res.status(200).json({
      status: "success",
      message: "Listing updated successfully",
      data: listing,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// DELETE /api/listings/:id - Delete listing (owner only)
exports.deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        status: "error",
        message: "Listing not found",
      });
    }

    // Check if user is the owner
    if (listing.owner.toString() !== req.user.id) {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to delete this listing",
      });
    }

    await Listing.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: "success",
      message: "Listing deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// ========== ADMIN ENDPOINTS ==========

// DELETE /api/admin/listings/:id - Delete any listing (admin only)
exports.deleteListingAdmin = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        status: "error",
        message: "Listing not found",
      });
    }

    await Listing.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: "success",
      message: "Listing deleted by admin successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// GET /api/listings/user/my-listings - Get user's listings
exports.getUserListings = async (req, res) => {
  try {
    const listings = await Listing.find({ owner: req.user.id }).populate(
      "owner",
      "username email"
    );

    res.status(200).json({
      status: "success",
      count: listings.length,
      data: listings,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};
