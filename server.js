// Load environment variables from .env file
require("dotenv").config();

// Import required dependencies
const express = require("express");
const cors = require("cors");

// Import local modules
const connectDB = require("./utils/connectDB");
const authRoutes = require("./routes/authRoutes");
const listingRoutes = require("./routes/listingRoutes");

// Initialize Express application
const app = express();

// Middleware Configuration
app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Enable Cross-Origin Resource Sharing

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);

// Default route for API health check
app.get("/api", (req, res) => {
  res.json({
    status: "ok",
    message: "Rental Store API is running",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: "error",
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

// Database connection
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start the server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Initialize the server
startServer();
