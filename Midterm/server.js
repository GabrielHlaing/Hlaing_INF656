const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

// route and middleware imports
const itemRoutes = require("./routes/itemRoutes");
const logger = require("./middleware/logger");
const { notFoundHandler } = require("./middleware/errorHandler");

// Create Logs directory if it does not exist
const logsDir = path.join(__dirname, "logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const app = express();
const PORT = process.env.PORT || 3000;

// CORS
app.use(cors());

// Built-in middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Custom logger middleware (logs method, url, timestamp)
app.use(logger);

// Serve static files from public/
app.use(express.static(path.join(__dirname, "public")));

// Route to index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// API routes
app.use("/api/items", itemRoutes);

// 404 handler for unknown routes (and log it)
app.use(notFoundHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
