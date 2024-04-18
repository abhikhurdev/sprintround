const express = require('express');
const WebSocket = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static('public'));

let teams = {
    team1: { name: "Team 1", score: 0 },
    team2: { name: "Team 2", score: 0 },
    team3: { name: "Team 3", score: 0 }
};

const broadcast = (data) => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
};

wss.on('connection', (ws) => {
    // Immediately send current scores and names
    ws.send(JSON.stringify({ type: 'update', data: teams }));

    ws.on('message', (message) => {
        const data = JSON.parse(message);

        if (data.type === 'scoreUpdate') {
            teams[data.team].score += data.score;
        } else if (data.type === 'nameUpdate') {
            teams[data.team].name = data.name;
        }

        broadcast({ type: 'update', data: teams });
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


