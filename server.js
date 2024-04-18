const express = require('express');
const WebSocket = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static files from 'public' directory
app.use(express.static('public'));

// Broadcast to all clients
const broadcast = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

// Handle WebSocket connection
wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.isAlive = true;

  ws.on('pong', () => {
    ws.isAlive = true;  // Mark the connection as active
  });

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    // Broadcast message to all connected clients
    broadcast(data);
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
});

// Interval to check every client connection for activity
setInterval(() => {
  wss.clients.forEach((ws) => {
    if (!ws.isAlive) return ws.terminate();
    ws.isAlive = false;
    ws.ping(null, false, true);  // Send a ping to the client
  });
}, 30000);  // Interval set for every 30 seconds

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
