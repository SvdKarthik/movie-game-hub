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

const selectedGame = getGameKeyFromUrl();
gameInput.value = selectedGame;
setupTitle.textContent = `${GAME_TITLES[selectedGame]} Setup`;
const isCharadesSetup = selectedGame === "charades";

if (isCharadesSetup) {
  modeFieldset.hidden = true;
  setupNote.textContent = "Dumb Charades is built for two teams. Enter both team names and start the Telugu movie challenge.";
} else {
  setupNote.textContent = "Choose solo or two-team mode, then start your movie challenge.";
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
syncModeFields();

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
    teamNames: mode === "team" || isCharadesSetup ? [teamOne, teamTwo] : ["Player"]
  });

  window.location.href = `games/${getGamePath(selectedGame)}`;
});
