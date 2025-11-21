const express = require("express");
const router = express.Router();
const {
  getAllListings,
  getListing,
  createListing,
  updateListing,
  deleteListing,
  deleteListingAdmin,
  getUserListings,
} = require("../controllers/listingController");
const { protect, authorize } = require("../middlewears/auth");

// ========== PUBLIC ROUTES ==========
router.get("/", getAllListings);
router.get("/:id", getListing);

// ========== PROTECTED USER ROUTES ==========
router.post("/", protect, createListing);
router.get("/user/my-listings", protect, getUserListings);
router.put("/:id", protect, updateListing);
router.delete("/:id", protect, deleteListing);

// ========== ADMIN ROUTES ==========
router.delete("/admin/:id", protect, authorize("admin"), deleteListingAdmin);

module.exports = router;
