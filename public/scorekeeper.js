const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const socket = new WebSocket(protocol + '//' + window.location.host);

function updateScore(team, points) {
  if (team === 'Team A') {
    socket.send(JSON.stringify({ teamA: points, teamB: 0 }));
  } else {
    socket.send(JSON.stringify({ teamA: 0, teamB: points }));
  }
}

socket.onerror = function(error) {
  console.log('WebSocket Error: ' + error);
};
