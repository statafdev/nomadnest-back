require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./utils/connectDB");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/api", (req, res) => {
  res.json({
    status: "ok",
    message: "Rental Store API is running",
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: "error",
    message: "Something went wrong!",
  });
});

app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
