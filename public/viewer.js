const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const socket = new WebSocket(protocol + '//' + window.location.host);

socket.onmessage = function(event) {
    const data = JSON.parse(event.data);
    if (data.type === 'update') {
        const scores = Object.values(data.data).map(team => `${team.name}: ${team.score}`).join(', ');
        document.getElementById('scoreDisplay').textContent = scores;
    }
};

socket.onerror = function(error) {
    console.log('WebSocket Error:', error);
};
