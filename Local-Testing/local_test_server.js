const http = require("http");
const fs = require("fs");
const path = require("path");

const port = 3000;

const server = http.createServer((req, res) => {
  // Determine the file path based on the request URL
  let filePath = "." + req.url;
  if (filePath === "./") {
    filePath = "./index.html"; // Default to serving index.html if URL is '/'
  }

  // Determine the content type based on the file extension
  const extname = path.extname(filePath);
  let contentType = "text/html";
  switch (extname) {
    case ".js":
      contentType = "text/javascript";
      break;
    case ".css":
      contentType = "text/css";
      break;
    case ".json":
      contentType = "application/json";
      break;
    case ".png":
      contentType = "image/png";
      break;
    // Add more content types as needed
  }

  // Read the file and serve its content
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === "ENOENT") {
        // File not found
        res.writeHead(404);
        res.end("404 Not Found");
      } else {
        // Server error
        res.writeHead(500);
        res.end("500 Internal Server Error");
      }
    } else {
      // Serve the file with appropriate content type
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf-8");
    }
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
