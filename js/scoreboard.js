function renderScoreboard(state) {
  const scoreboard = document.querySelector("[data-scoreboard]");
  if (!scoreboard) return;

  const teams = state.teams
    .map((team, index) => {
      const isCurrent = index === state.currentTeamIndex;
      return `
        <article class="score-team ${isCurrent ? "is-current" : ""}">
          <div>
            <h3>${team.name}</h3>
            <p>${team.score} points</p>
          </div>
          <span title="Current streak">🔥 ${team.streak}</span>
        </article>
      `;
    })
    .join("");

  scoreboard.innerHTML = `
    <div class="scoreboard-header">
      <span>Current Turn</span>
      <strong>${getCurrentTeam(state).name}</strong>
    </div>
    <div class="scoreboard-teams">${teams}</div>
  `;
}
