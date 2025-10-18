const fs = require("fs");
const path = require("path");

const requestsFile = path.join(__dirname, "..", "logs", "requests.txt");

function logger(req, res, next) {
  const now = new Date().toISOString();
  const line = `${now}\t${req.method} \t ${req.originalUrl}\n`;
  // append to requests.txt (fire-and-forget)
  fs.appendFile(requestsFile, line, (err) => {
    if (err) {
      console.error("Failed to write request log:", err);
    }
  });
  next();
}

module.exports = logger;
