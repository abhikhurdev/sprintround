const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static('public'));

const dataPath = path.join(__dirname, 'scoreboard.json');

let teams = {};

function loadTeams() {
    if (fs.existsSync(dataPath)) {
        teams = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    }
}

function saveTeams() {
    fs.writeFileSync(dataPath, JSON.stringify(teams, null, 2), 'utf8');
}

loadTeams();

const broadcast = (data) => {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
};

wss.on('connection', (ws) => {
  ws.send(JSON.stringify({ type: 'update', data: teams }));
  console.log('Client connected');
  ws.isAlive = true;

  ws.on('pong', () => {
      ws.isAlive = true;
  });

  ws.on('message', (message) => {
      // Handle incoming messages
  });

  ws.on('close', () => {
      console.log('WebSocket connection closed');
  });
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        switch (data.type) {
            case 'scoreUpdate':
                teams[data.team].score += data.score;
                break;
            case 'nameUpdate':
                teams[data.team].name = data.name;
                break;
            case 'addTeam':
                teams[data.teamId] = { name: data.name, score: 0 };
                break;
            case 'removeTeam':
                delete teams[data.teamId];
                break;
        }
        saveTeams();
        broadcast({ type: 'update', data: teams });
    });
});

// Ping every 30 seconds to keep the connections alive
setInterval(() => {
  wss.clients.forEach((ws) => {
      if (!ws.isAlive) return ws.terminate();
      
      ws.isAlive = false;
      ws.ping(null, false, true);
  });
}, 30000);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
