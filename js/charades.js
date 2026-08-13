const savedSetup = getSavedSetup();
const charadesTeamNames = savedSetup.teamNames && savedSetup.teamNames.length === 2
  ? savedSetup.teamNames
  : ["Team Mass", "Team Class"];
const state = createGameState("charades", { mode: "team", teamNames: charadesTeamNames });
const timerEl = document.querySelector("[data-timer]");
const movieTitle = document.querySelector("[data-movie-title]");
const progress = document.querySelector("[data-progress]");
const startButton = document.querySelector("[data-start-round]");
const correctButton = document.querySelector("[data-correct]");
const skipButton = document.querySelector("[data-skip]");
const feedback = document.querySelector("[data-feedback]");
const teamHeading = document.querySelector("[data-charades-team]");
const readyLabel = document.querySelector("[data-ready-label]");
const enableMotionButton = document.querySelector("[data-enable-motion]");
const gestureHint = document.querySelector("[data-gesture-hint]");
const burst = document.querySelector("[data-answer-burst]");

const ROUND_SECONDS = 60;
const TILT_THRESHOLD = 45;
const TILT_RESET_THRESHOLD = 18;
const TILT_COOLDOWN_MS = 1100;
let secondsLeft = ROUND_SECONDS;
let timerId = null;
let roundActive = false;
let completedRounds = 0;
let motionEnabled = false;
let lastTiltActionAt = 0;
let gestureArmed = true;
let audioContext = null;

function renderCharades() {
  renderScoreboard(state);
  teamHeading.textContent = getCurrentTeam(state).name;
  progress.textContent = `Movie ${getProgressText(state)}`;

  const movie = getCurrentMovie(state);
  movieTitle.textContent = movie ? movie.title : "No more movies";
}

function setRoundButtons(isActive) {
  startButton.hidden = isActive;
  correctButton.hidden = !isActive;
  skipButton.hidden = !isActive;
}

function startRound() {
  if (state.finished) {
    goToResults(state);
    return;
  }

  secondsLeft = ROUND_SECONDS;
  roundActive = true;
  readyLabel.textContent = "Act It Out";
  feedback.textContent = "";
  timerEl.textContent = secondsLeft;
  setRoundButtons(true);
  renderCharades();

  timerId = window.setInterval(() => {
    secondsLeft -= 1;
    timerEl.textContent = secondsLeft;

    if (secondsLeft <= 0) {
      endRound();
    }
  }, 1000);
}

function endRound() {
  window.clearInterval(timerId);
  timerId = null;
  roundActive = false;
  completedRounds += 1;
  setRoundButtons(false);

  if (state.finished || completedRounds >= state.teams.length) {
    goToResults(state);
    return;
  }

  switchTeam(state);
  readyLabel.textContent = "Get Ready";
  feedback.textContent = `${getCurrentTeam(state).name}, get ready!`;
  movieTitle.textContent = "Press Start Round";
  progress.textContent = `Movie ${getProgressText(state)}`;
  teamHeading.textContent = getCurrentTeam(state).name;
  renderScoreboard(state);
}

function handleAnswer(isCorrect) {
  if (!roundActive || state.finished) return;

  if (isCorrect) {
    recordCorrect(state);
    feedback.textContent = "Correct!";
    feedback.classList.add("is-good");
    playTone(720, 0.12, "sine");
    showBurst("Correct", "good");
  } else {
    recordSkip(state);
    feedback.textContent = "Skipped.";
    feedback.classList.remove("is-good");
    playTone(170, 0.16, "sawtooth");
    showBurst("Skip", "skip");
  }

  advanceQuestion(state);
  renderCharades();

  if (state.finished) {
    endRound();
  }
}

function showBurst(label, type) {
  burst.textContent = label;
  burst.className = `answer-burst show ${type}`;
  window.setTimeout(() => {
    burst.className = "answer-burst";
  }, 620);
}

function playTone(frequency, duration, type) {
  try {
    audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.18, audioContext.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  } catch (error) {
    return;
  }
}

function handleOrientation(event) {
  if (!motionEnabled || !roundActive) return;

  const now = Date.now();
  const beta = event.beta;
  if (typeof beta !== "number") return;

  if (Math.abs(beta) < TILT_RESET_THRESHOLD) {
    gestureArmed = true;
  }

  if (!gestureArmed || now - lastTiltActionAt < TILT_COOLDOWN_MS) return;

  if (beta > TILT_THRESHOLD) {
    gestureArmed = false;
    lastTiltActionAt = now;
    handleAnswer(true);
  }

  if (beta < -TILT_THRESHOLD) {
    gestureArmed = false;
    lastTiltActionAt = now;
    handleAnswer(false);
  }
}

async function enableMotionControls() {
  try {
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      const permission = await DeviceOrientationEvent.requestPermission();
      if (permission !== "granted") {
        gestureHint.textContent = "Tilt permission was not granted. You can still play with the buttons.";
        return;
      }
    }

    window.addEventListener("deviceorientation", handleOrientation);
    motionEnabled = true;
    enableMotionButton.hidden = true;
    gestureHint.textContent = "Tilt controls ready: downward = Correct, upward = Skip.";
  } catch (error) {
    gestureHint.textContent = "Tilt controls are unavailable here. Buttons are ready.";
  }
}

startButton.addEventListener("click", startRound);
correctButton.addEventListener("click", () => handleAnswer(true));
skipButton.addEventListener("click", () => handleAnswer(false));
enableMotionButton.addEventListener("click", enableMotionControls);

renderScoreboard(state);
teamHeading.textContent = getCurrentTeam(state).name;
progress.textContent = `Movie ${getProgressText(state)}`;

if ("DeviceOrientationEvent" in window) {
  enableMotionButton.hidden = false;
} else {
  gestureHint.textContent = "Tilt controls need an Android phone browser. Buttons work everywhere.";
}
