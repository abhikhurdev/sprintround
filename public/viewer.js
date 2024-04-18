const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const socket = new WebSocket(protocol + '//' + window.location.host);

socket.onopen = function() {
    console.log('WebSocket connection established.');
};

socket.onmessage = function(event) {
    const data = JSON.parse(event.data);
    document.getElementById('scoreDisplay').textContent = `Team A: ${data.teamA} - Team B: ${data.teamB}`;
    console.log('Data received:', data);
};

socket.onerror = function(error) {
    console.log('WebSocket Error:', error);
};
