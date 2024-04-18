const socket = new WebSocket('ws://localhost:3000');

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
