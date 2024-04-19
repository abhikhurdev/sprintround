const express = require('express');
const WebSocket = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static('public'));

let teams = {};
var keepAlive = null;
var keepAliveInterval = 5000;

const broadcast = (data) => {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
};

wss.on('connection', (ws) => {
  function ping(client) {
    if (ws.readyState === SOCKET_OPEN) {
      ws.send('__ping__');
    } else {
      console.log('Server - connection has been closed for client ' + client);
    }
  }
  ws.send(JSON.stringify({ type: 'update', data: teams }));
  function pong(client) {
    console.log('Server - ' + client + ' is still active');
    clearTimeout(keepAlive);
    setTimeout(function () {
      ping(client);
    }, keepAliveInterval);
  }
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        if(data.keepAlive !== undefined){
          pong(data.keepAlive.toLowerCase())
        }
        
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
        broadcast({ type: 'update', data: teams });
    });
  ws.on('close', () => {
      console.log('WebSocket connection closed');
  });
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
