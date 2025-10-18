const fs = require("fs");
const path = require("path");

const errorFile = path.join(__dirname, "..", "logs", "error.txt");

// 404 handler for unknown routes (this comes before global error handler)
function notFoundHandler(req, res, next) {
  const message = `404 | ${new Date().toISOString()} \t ${req.method} ${
    req.originalUrl
  }\n`;
  fs.appendFile(errorFile, message, (err) => {
    if (err) console.error("Failed to write error log:", err);
  });
  res.status(404).json({ error: "Not Found" });
}

module.exports = {
  notFoundHandler,
};
