// 1. Gérer dotenv : Charger les variables uniquement si on n'est PAS en production (Vercel gère l'injection)
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const cors = require("cors");

const connectDB = require("./utils/connectDB");
const authRoutes = require("./routes/auth.routes");
const listingRoutes = require("./routes/listing.routes");

const app = express();

app.use(express.json());
app.use(cors());

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

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: "error",
    message: "Something went wrong!",
    // Afficher l'erreur détaillée seulement en mode Dev
    error: NODE_ENV === "development" ? err.message : undefined,
  });
});

app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

// --- Démarrage du serveur (uniquement en local) ---
// Vercel Serverless Functions n'ont pas besoin de app.listen()
if (process.env.NODE_ENV !== "production") {
  connectDB();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
}

// 🔑 EXPORTATION FINALE pour VERCEL 🔑
// Quand Vercel appelle la fonction Serverless, il utilise cette instance
module.exports = app;
