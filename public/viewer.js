const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const socket = new WebSocket(protocol + '//' + window.location.host);

socket.onmessage = function(event) {
    const data = JSON.parse(event.data);
    if (data.type === 'update') {
        const teams = data.data;
        displayTeams(teams);
    }
    
};

function displayTeams(teams) {
    const scoreDisplay = document.getElementById('scoreDisplay');
    scoreDisplay.innerHTML = ''; // Clear previous content

    // Convert teams object to array and sort by score
    const sortedTeams = Object.entries(teams).sort((a, b) => b[1].score - a[1].score);
    
    sortedTeams.forEach(([key, team], index) => {
        const rank = index + 1;
        const teamInfo = document.createElement('p');
        teamInfo.textContent = `${rank}. ${team.name}: ${team.score}`;
        scoreDisplay.appendChild(teamInfo);
    });
}

socket.onerror = function(error) {
    console.log('WebSocket Error:', error);
};

socket.onclose = function() {
  console.log('WebSocket connection closed. Attempting to reconnect...');
  setTimeout(setupWebSocket, 3000);  // attempt to reconnect after 3 seconds
};

window.websocket = socket;
