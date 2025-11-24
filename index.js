// 📁 api/index.js
// Vercel Serverless Functions a besoin d'exporter l'instance de l'application
const app = require("../server");
module.exports = app;
