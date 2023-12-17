const http = require('http');
const fs = require('fs');

const server = http.createServer(function (req, res) {
  fs.readFile('./index.html', (err, html) => {
    if (!err) {
      res.writeHeader(200, { 'Content-Type': 'text/html' });
      res.write(html);
      res.end();
    }
  });
});

server.listen(3000, '192.168.0.8');
