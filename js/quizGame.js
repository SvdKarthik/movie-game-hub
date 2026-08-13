function startQuizGame(config) {
  const state = createGameState(config.gameKey);
  const image = document.querySelector("[data-question-image]");
  const emoji = document.querySelector("[data-emoji-clue]");
  const form = document.querySelector("[data-guess-form]");
  const input = document.querySelector("[data-answer-input]");
  const feedback = document.querySelector("[data-feedback]");
  const progress = document.querySelector("[data-progress]");
  const currentTeam = document.querySelector("[data-current-team]");

  function renderQuestion() {
    if (state.finished) {
      goToResults(state);
      return;
    }

    const movie = getCurrentMovie(state);
    renderScoreboard(state);
    progress.textContent = `Question ${getProgressText(state)}`;
    currentTeam.textContent = `${getCurrentTeam(state).name}'s turn`;
    feedback.textContent = "";
    feedback.classList.remove("is-good");
    input.value = "";
    input.focus();

    if (config.type === "poster") {
      image.src = movie.poster;
      image.alt = "Poster clue";
    }

    if (config.type === "closeup") {
      image.src = movie.closeup;
      image.alt = "Close-up clue";
    }

    if (config.type === "emoji") {
      emoji.textContent = movie.emojis;
    }
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const movie = getCurrentMovie(state);

    if (!input.value.trim()) {
      feedback.textContent = "Enter a guess first.";
      feedback.classList.remove("is-good");
      return;
    }

    if (isCorrectAnswer(input.value, movie)) {
      recordCorrect(state);
      feedback.textContent = "Correct!";
      feedback.classList.add("is-good");
    } else {
      recordSkip(state);
      feedback.textContent = `Wrong. The answer was ${movie.title}.`;
      feedback.classList.remove("is-good");
    }

    advanceQuestion(state);
    switchTeam(state);
    renderScoreboard(state);

    window.setTimeout(renderQuestion, 850);
  });

  renderQuestion();
}
