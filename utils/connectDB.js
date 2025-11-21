const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "Environment variable MONGODB_URI is not set. Create a `.env` file (or set the variable) with your MongoDB connection string."
    );
  }

  try {
    await mongoose.connect(uri);
    console.log("connected to database");
  } catch (e) {
    console.error("Error connecting to MongoDB:", e.message || e);
    throw e;
  }
};

module.exports = connectDB;
