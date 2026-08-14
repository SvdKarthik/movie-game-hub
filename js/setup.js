const gameInput = document.querySelector("#gameKey");
const modeRadios = document.querySelectorAll("input[name='mode']");
const teamFields = document.querySelector("[data-team-fields]");
const teamOneInput = document.querySelector("#teamOne");
const teamTwoInput = document.querySelector("#teamTwo");
const form = document.querySelector("[data-setup-form]");
const errorBox = document.querySelector("[data-form-error]");
const setupTitle = document.querySelector("[data-setup-title]");
const setupNote = document.querySelector("[data-setup-note]");
const modeFieldset = document.querySelector("[data-mode-fieldset]");
const timerFields = document.querySelector("[data-timer-fields]");
const roundSecondsInput = document.querySelector("#roundSeconds");
const timerPreview = document.querySelector("[data-timer-preview]");

const TEAM_NAME_PAIRS = [
  ["Team Mass", "Team Class"],
  ["Team Rebel", "Team Royal"],
  ["Team Fire", "Team Thunder"],
  ["Team Mega", "Team Power"],
  ["Team Sankranthi", "Team Dasara"],
  ["Team Interval", "Team Climax"]
];

const selectedGame = getGameKeyFromUrl();
gameInput.value = selectedGame;
setupTitle.textContent = `${GAME_TITLES[selectedGame]} Setup`;
const isCharadesSetup = selectedGame === "charades";

if (isCharadesSetup) {
  modeFieldset.hidden = true;
  timerFields.hidden = false;
  applyRandomTeamNames();
  setupNote.textContent = "Dumb Charades is built for two teams. Pick a timer, then guess as many Telugu movies as possible before time runs out.";
} else {
  setupNote.textContent = "Choose solo or two-team mode, then start your movie challenge.";
}

function applyRandomTeamNames() {
  const pair = TEAM_NAME_PAIRS[Math.floor(Math.random() * TEAM_NAME_PAIRS.length)];
  teamOneInput.value = pair[0];
  teamTwoInput.value = pair[1];
}

function formatSeconds(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function syncTimerPreview() {
  timerPreview.textContent = formatSeconds(Number(roundSecondsInput.value));
}

function getSelectedMode() {
  if (isCharadesSetup) return "team";
  return document.querySelector("input[name='mode']:checked").value;
}

function syncModeFields() {
  const isTeamMode = isCharadesSetup || getSelectedMode() === "team";
  teamFields.hidden = !isTeamMode;
  teamOneInput.required = isTeamMode;
  teamTwoInput.required = isTeamMode;
}

modeRadios.forEach((radio) => radio.addEventListener("change", syncModeFields));
roundSecondsInput.addEventListener("input", syncTimerPreview);
syncModeFields();
syncTimerPreview();

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const mode = getSelectedMode();
  const teamOne = teamOneInput.value.trim();
  const teamTwo = teamTwoInput.value.trim();

  errorBox.textContent = "";

  if ((mode === "team" || isCharadesSetup) && (!teamOne || !teamTwo)) {
    errorBox.textContent = "Please enter both team names before starting.";
    return;
  }

  saveSetup({
    mode: isCharadesSetup ? "team" : mode,
    teamNames: mode === "team" || isCharadesSetup ? [teamOne, teamTwo] : ["Player"],
    roundSeconds: isCharadesSetup ? Number(roundSecondsInput.value) : undefined
  });

  window.location.href = `games/${getGamePath(selectedGame)}`;
});
