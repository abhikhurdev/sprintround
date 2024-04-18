const socket = new WebSocket('ws://' + window.location.host);

socket.onmessage = function(event) {
    const data = JSON.parse(event.data);
    if (data.type === 'update') {
        updateUI(data.data);
    }
};

function updateUI(teams) {
  const container = document.getElementById('teamControls');
  container.innerHTML = ''; // Clear previous UI

  // Convert teams object to array and sort by score
  const sortedTeams = Object.entries(teams).sort((a, b) => b[1].score - a[1].score);

  sortedTeams.forEach(([key, team], index) => {
      const teamDiv = document.createElement('div');
      const rank = index + 1;  // Calculate ranking based on sort order

      teamDiv.innerHTML = `
          <label>${rank}. ${team.name}: </label>
          <input type="number" value="${team.score}" onchange="updateScore('${key}', parseInt(this.value, 10) - teams['${key}'].score)">
          <input value="${team.name}" onchange="updateName('${key}', this.value)">
          <button onclick="removeTeam('${key}')">Remove</button>`;
      container.appendChild(teamDiv);
  });
}


function updateScore(teamId, scoreChange) {
    socket.send(JSON.stringify({ type: 'scoreUpdate', team: teamId, score: scoreChange }));
}

function updateName(teamId, newName) {
    socket.send(JSON.stringify({ type: 'nameUpdate', team: teamId, name: newName }));
}

function addTeam() {
    const teamId = `team${Date.now()}`;
    socket.send(JSON.stringify({ type: 'addTeam', teamId: teamId, name: 'New Team' }));
}

function removeTeam(teamId) {
    socket.send(JSON.stringify({ type: 'removeTeam', teamId: teamId }));
}
