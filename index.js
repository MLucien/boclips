const http = require('http');
const fs = require('fs');

const port = 3000;

const server = http.createServer((req, res) => {
  // Serve the index.html file
  if (req.url === '/') {
    fs.readFile('index.html', (err, data) => {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading index.html');
      }
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(data);
    });
  } else {
    // Handle other routes here
    res.writeHead(404);
    res.end();
  }
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
