let players = [];
let answers = {};
let scores = {};
let correctAnswer = "";
let questioner = "";
let answerPhaseIndex = 0;
let guessingPlayers = [];

function addPlayer() {
  const playerName = document.getElementById("player-name").value;
  if (playerName && !players.includes(playerName)) {
    players.push(playerName);
    scores[playerName] = 0;
    updatePlayersList();
  }
  document.getElementById("player-name").value = "";
}

function updatePlayersList() {
  const playersList = document.getElementById("players-list");
  playersList.innerHTML = "";
  players.forEach((player) => {
    const li = document.createElement("li");
    li.textContent = player;
    playersList.appendChild(li);
  });
}

function chooseQuestioner() {
  if (players.length > 0) {
    questioner = players[Math.floor(Math.random() * players.length)];
    document.getElementById(
      "questioner"
    ).textContent = `${questioner}, please set the question and correct answer.`;
    document.getElementById("player-container").style.display = "none";
    document.getElementById("question-container").style.display = "block";
  }
}

function setQuestionAndAnswer() {
  const question = document.getElementById("question").value;
  correctAnswer = document.getElementById("correct-answer").value;
  if (question && correctAnswer) {
    answers = {};
    document.getElementById("question-container").style.display = "none";
    document.getElementById("answer-container").style.display = "block";
    answerPhaseIndex = 0;
    promptNextPlayer();
  }
}

function promptNextPlayer() {
  const answeringPlayers = players.filter((player) => player !== questioner);
  if (answerPhaseIndex < answeringPlayers.length) {
    const currentPlayer = answeringPlayers[answerPhaseIndex];
    document.getElementById(
      "current-player"
    ).textContent = `${currentPlayer}, please enter your answer.`;
  } else {
    document.getElementById("answer-container").style.display = "none";
    document.getElementById("guess-container").style.display = "block";
    guessingPlayers = players.filter((player) => player !== questioner);
    shuffleAnswers();
  }
}

function submitAnswer() {
  const playerAnswer = document.getElementById("player-answer").value;
  const answeringPlayers = players.filter((player) => player !== questioner);
  const currentPlayer = answeringPlayers[answerPhaseIndex];
  if (playerAnswer && currentPlayer) {
    answers[currentPlayer] = playerAnswer;
    answerPhaseIndex++;
    document.getElementById("player-answer").value = "";
    promptNextPlayer();
  }
}

function shuffleAnswers() {
  const answersList = document.getElementById("answers-list");
  answersList.innerHTML = "";
  const shuffledAnswers = Object.entries(answers).concat([
    ["Correct Answer", correctAnswer],
  ]);
  shuffledAnswers.sort(() => Math.random() - 0.5);
  shuffledAnswers.forEach(([player, answer], index) => {
    const li = document.createElement("li");
    li.textContent = `${index + 1}. ${answer}`;
    li.onclick = () => guessAnswer(player, answer);
    answersList.appendChild(li);
  });
}

function guessAnswer(player, guessedAnswer) {
  const currentPlayer = guessingPlayers.shift();
  if (guessedAnswer === correctAnswer) {
    scores[currentPlayer]++;
  }
  if (player !== "Correct Answer") {
    scores[player]++;
  }
  if (guessingPlayers.length === 0) {
    document.getElementById("guess-container").style.display = "none";
    document.getElementById("result-container").style.display = "block";
    showScores();
  } else {
    promptNextPlayerForGuessing();
  }
}

function promptNextPlayerForGuessing() {
  if (guessingPlayers.length > 0) {
    const currentPlayer = guessingPlayers[0];
    document.getElementById(
      "current-player"
    ).textContent = `${currentPlayer}, please guess the correct answer.`;
  }
}

function showScores() {
  const scoresList = document.getElementById("scores-list");
  scoresList.innerHTML = "";
  Object.entries(scores).forEach(([player, score]) => {
    const li = document.createElement("li");
    li.textContent = `${player}: ${score} points`;
    scoresList.appendChild(li);
  });
}

function startGame() {
  document.getElementById("start-button").style.display = "none";
  document.getElementById("player-container").style.display = "block";
  players = [];
  scores = {};
  correctAnswer = "";
  questioner = "";
  answerPhaseIndex = 0;
  guessingPlayers = [];
  updatePlayersList();
}

// Initialize the game on page load
window.onload = () => {
  document.getElementById("start-button").style.display = "block";
};
