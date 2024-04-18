const socket = new WebSocket('ws://localhost:3000');

socket.onmessage = function(event) {
  const data = JSON.parse(event.data);
  document.getElementById('scoreDisplay').textContent = `Team A: ${data.teamA} - Team B: ${data.teamB}`;
};

socket.onerror = function(error) {
  console.log('WebSocket Error: ' + error);
};
