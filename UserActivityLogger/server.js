const http = require("http");
const fs = require("fs");

let logs = [];
let batchStartTime = Date.now();

// Create server
const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/") {
    // read index.html
    fs.readFile("index.html", "utf8", (err, data) => {
      if (err) {
        res.writeHead(500);
        return res.end("Error loading Home Page");
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
      }
    });
  } else if (req.method === "POST") {
    // Handle log requests
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        const event = JSON.parse(body);

        // Format timestamp to MM:SS form
        const timestamp = Math.floor((Date.now() - batchStartTime) / 1000);
        const minutes = Math.floor(timestamp / 60);
        const seconds = timestamp % 60;

        let message;
        if (event.action === "button") {
          message = `You clicked ${event.detail} at ${minutes}:${seconds}`;
        } else if (event.action === "form") {
          message = `You entered "${event.detail}" at ${minutes}:${seconds}`;
        } else {
          message = `Unknown action at ${minutes}:${seconds}`;
        }

        logs.push(message);

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Event added to log list" }));
      } catch (err) {
        res.writeHead(400);
        res.end("Invalid JSON");
      }
    });
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

// Process logs every 2 minutes
setInterval(() => {
  if (logs.length > 0) {
    console.log("\n===== Batch Log =====");
    logs.forEach((log) => console.log(log));
    console.log("=====================\n");

    logs = []; // clear logs for next batch
    batchStartTime = Date.now(); // reset start time
  }
}, 2 * 60 * 1000); // 2 minutes

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000/");
});
