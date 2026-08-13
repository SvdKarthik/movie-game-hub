const POINTS_FOR_CORRECT = 10;

const GAME_ROUTES = {
  charades: "charades.html",
  poster: "poster.html",
  closeup: "closeup.html",
  emoji: "emoji.html"
};

const GAME_TITLES = {
  charades: "Dumb Charades",
  poster: "Guess the Poster",
  closeup: "Close-Up Challenge",
  emoji: "Emoji Movie Challenge"
};

function createTeams(mode, teamNames = []) {
  if (mode === "solo") {
    return [createTeam(teamNames[0] || "Player")];
  }

  return [
    createTeam(teamNames[0] || "Team 1"),
    createTeam(teamNames[1] || "Team 2")
  ];
}

function createTeam(name) {
  return {
    name,
    score: 0,
    streak: 0,
    highestStreak: 0,
    correct: 0,
    skipped: 0
  };
}

function createGameState(gameKey, options = {}) {
  const setup = getSavedSetup();
  const mode = options.mode || setup.mode || "team";
  const teamNames = options.teamNames || setup.teamNames || ["Team 1", "Team 2"];

  return {
    gameKey,
    gameTitle: GAME_TITLES[gameKey] || "Movie Game",
    mode,
    teams: createTeams(mode, teamNames),
    currentTeamIndex: 0,
    currentIndex: 0,
    questionOrder: shuffleItems(MOVIES),
    finished: false
  };
}

function getCurrentTeam(state) {
  return state.teams[state.currentTeamIndex];
}

function recordCorrect(state) {
  const team = getCurrentTeam(state);
  team.score += POINTS_FOR_CORRECT;
  team.correct += 1;
  team.streak += 1;
  team.highestStreak = Math.max(team.highestStreak, team.streak);
}

function recordSkip(state) {
  const team = getCurrentTeam(state);
  team.skipped += 1;
  team.streak = 0;
}

function switchTeam(state) {
  if (state.teams.length > 1) {
    state.currentTeamIndex = (state.currentTeamIndex + 1) % state.teams.length;
  }
}

function getCurrentMovie(state) {
  return state.questionOrder[state.currentIndex] || null;
}

function advanceQuestion(state) {
  state.currentIndex += 1;

  if (state.currentIndex >= state.questionOrder.length) {
    state.finished = true;
  }
}

function getProgressText(state) {
  const current = Math.min(state.currentIndex + 1, state.questionOrder.length);
  return `${current} / ${state.questionOrder.length}`;
}

function normalizeAnswer(value) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

function isCorrectAnswer(guess, movie) {
  return normalizeAnswer(guess) === normalizeAnswer(movie.title);
}

function determineWinner(teams) {
  if (teams.length === 1) {
    return { type: "solo", message: `${teams[0].name} scored ${teams[0].score} points!` };
  }

  const sorted = [...teams].sort((a, b) => b.score - a.score);

  if (sorted[0].score === sorted[1].score) {
    return { type: "tie", message: "It's a tie!" };
  }

  return { type: "winner", team: sorted[0], message: `${sorted[0].name} wins!` };
}

function saveSetup(setup) {
  sessionStorage.setItem("movieGameHubSetup", JSON.stringify(setup));
}

function getSavedSetup() {
  const fallback = { mode: "team", teamNames: ["Team 1", "Team 2"] };
  const raw = sessionStorage.getItem("movieGameHubSetup");

  if (!raw) return fallback;

  try {
    return { ...fallback, ...JSON.parse(raw) };
  } catch (error) {
    return fallback;
  }
}

function getGameKeyFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("game") || "charades";
}

function getGamePath(gameKey) {
  return GAME_ROUTES[gameKey] || GAME_ROUTES.charades;
}

function goToResults(state) {
  renderResults(state);
}

function renderResults(state) {
  const app = document.querySelector("[data-game-root]");
  const winner = determineWinner(state.teams);
  const rows = state.teams
    .map(
      (team) => `
        <article class="result-card">
          <h3>${team.name}</h3>
          <p class="result-score">${team.score} points</p>
          <dl>
            <div><dt>Correct</dt><dd>${team.correct}</dd></div>
            <div><dt>Skipped/Wrong</dt><dd>${team.skipped}</dd></div>
            <div><dt>Highest streak</dt><dd>${team.highestStreak}</dd></div>
          </dl>
        </article>
      `
    )
    .join("");

  app.innerHTML = `
    <section class="result-screen">
      <p class="eyebrow">Game Over</p>
      <h1>${winner.message}</h1>
      <div class="result-grid">${rows}</div>
      <div class="action-row">
        <a class="button primary" href="${getGamePath(state.gameKey)}">Play Again</a>
        <a class="button secondary" href="../dashboard.html">Back to Dashboard</a>
      </div>
    </section>
  `;
}
