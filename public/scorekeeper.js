const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const socket = new WebSocket(protocol + '//' + window.location.host);

// Store teams data locally for reference in change events
let teams = {};

socket.onmessage = function(event) {
    const data = JSON.parse(event.data);
    if (data.type === 'update') {
        teams = data.data; // Update local teams data
        updateUI(teams);
    }
};

function updateUI(teams) {
    const container = document.getElementById('teamControls');
    container.innerHTML = ''; // Clear previous UI

    // Convert teams object to array and sort by score
    const sortedTeams = Object.entries(teams).sort((a, b) => b[1].score - a[1].score);
    const unsortedTeams = Object.entries(teams)
    unsortedTeams.forEach(([key, team], index) => {
        const teamDiv = document.createElement('div');
        const rank = index + 1;  // Calculate ranking based on sort order

        teamDiv.innerHTML = `
            <label>Team ${rank}. ${team.name}: </label>
            <input type="number" value="${team.score}" id="score-${key}">
            <button onclick="updateScore('${key}')">Update Score</button>
            <input value="${team.name}" id="name-${key}">
            <button onclick="updateName('${key}')">Update Name</button>
            <button onclick="removeTeam('${key}')">Remove</button>`;
        container.appendChild(teamDiv);
    });
}

function updateScore(teamId) {
    const scoreInput = document.getElementById(`score-${teamId}`);
    const scoreValue = parseInt(scoreInput.value, 10);
    const scoreChange = scoreValue - teams[teamId].score; // Calculate the change needed
    socket.send(JSON.stringify({ type: 'scoreUpdate', team: teamId, score: scoreChange }));
}

function updateName(teamId) {
    const nameInput = document.getElementById(`name-${teamId}`);
    const newName = nameInput.value;
    socket.send(JSON.stringify({ type: 'nameUpdate', team: teamId, name: newName }));
}

function addTeam() {
    const teamId = `team${Date.now()}`;
    socket.send(JSON.stringify({ type: 'addTeam', teamId: teamId, name: 'New Team' }));
}

function removeTeam(teamId) {
    socket.send(JSON.stringify({ type: 'removeTeam', teamId: teamId }));
}

socket.onerror = function(error) {
    console.log('WebSocket Error:', error);
};

socket.onclose = function() {
  console.log('WebSocket connection closed. Attempting to reconnect...');
  setTimeout(setupWebSocket, 3000);  // attempt to reconnect after 3 seconds
};

window.websocket = socket;