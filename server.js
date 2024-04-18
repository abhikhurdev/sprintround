const express = require('express');
const WebSocket = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static('public'));

let teams = {};

const broadcast = (data) => {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
};

wss.on('connection', (ws) => {
  ws.send(JSON.stringify({ type: 'update', data: teams }));
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
  ws.on('close', () => {
      console.log('WebSocket connection closed');
  });
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
