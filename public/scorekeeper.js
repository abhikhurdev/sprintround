const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const socket = new WebSocket(protocol + '//' + window.location.host);

socket.onmessage = function(event) {
    const data = JSON.parse(event.data);
    if (data.type === 'update') {
        updateUI(data.data);
    }
};

function updateUI(teams) {
    const container = document.getElementById('teamControls');
    container.innerHTML = ''; // Clear previous UI

    for (const [key, team] of Object.entries(teams)) {
        const teamDiv = document.createElement('div');

        const nameLabel = document.createElement('label');
        nameLabel.textContent = team.name + ': ';
        teamDiv.appendChild(nameLabel);

        const scoreInput = document.createElement('input');
        scoreInput.type = 'number';
        scoreInput.value = team.score;
        scoreInput.addEventListener('change', () => {
            socket.send(JSON.stringify({ type: 'scoreUpdate', team: key, score: parseInt(scoreInput.value, 10) - team.score }));
        });
        teamDiv.appendChild(scoreInput);

        const nameInput = document.createElement('input');
        nameInput.value = team.name;
        nameInput.addEventListener('change', () => {
            socket.send(JSON.stringify({ type: 'nameUpdate', team: key, name: nameInput.value }));
        });
        teamDiv.appendChild(nameInput);

        container.appendChild(teamDiv);
    }
}

socket.onerror = function(error) {
    console.log('WebSocket Error:', error);
};

