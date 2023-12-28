const TOTAL_SQUARES = 81;
let filledSquares = 0;
const questionBoard = [
  [3, 0, 5, 4, 0, 2, 0, 6, 0],
  [4, 9, 0, 7, 6, 0, 1, 0, 8],
  [6, 0, 0, 1, 0, 3, 2, 4, 5],
  [0, 0, 3, 9, 0, 0, 5, 8, 0],
  [9, 6, 0, 0, 5, 8, 7, 0, 3],
  [0, 8, 1, 3, 0, 4, 0, 9, 2],
  [0, 5, 0, 6, 0, 1, 4, 0, 0],
  [2, 0, 0, 5, 4, 9, 0, 7, 0],
  [1, 4, 9, 0, 0, 7, 3, 0, 6]
];
const progressBoard = [
  [3, 0, 5, 4, 0, 2, 0, 6, 0],
  [4, 9, 0, 7, 6, 0, 1, 0, 8],
  [6, 0, 0, 1, 0, 3, 2, 4, 5],
  [0, 0, 3, 9, 0, 0, 5, 8, 0],
  [9, 6, 0, 0, 5, 8, 7, 0, 3],
  [0, 8, 1, 3, 0, 4, 0, 9, 2],
  [0, 5, 0, 6, 0, 1, 4, 0, 0],
  [2, 0, 0, 5, 4, 9, 0, 7, 0],
  [1, 4, 9, 0, 0, 7, 3, 0, 6]
];
const answerBoard = [
  [3, 1, 5, 4, 8, 2, 9, 6, 7],
  [4, 9, 2, 7, 6, 5, 1, 3, 8],
  [6, 7, 8, 1, 9, 3, 2, 4, 5],
  [7, 2, 3, 9, 1, 6, 5, 8, 4],
  [9, 6, 4, 2, 5, 8, 7, 1, 3],
  [5, 8, 1, 3, 7, 4, 6, 9, 2],
  [8, 5, 7, 6, 3, 1, 4, 2, 9],
  [2, 3, 6, 5, 4, 9, 8, 7, 1],
  [1, 4, 9, 8, 2, 7, 3, 5, 6]
];
let errorCount = 0;
let secondsElapsed = 0;
const GameState = {
  NOT_STARTED: "NOT_STARTED",
  PAUSED: "PAUSED",
  PLAYING: "PLAYING",
  GAME_OVER: "GAME_OVER",
  GAME_WIN: "GAME_WIN"
};

let currentGameState = GameState.NOT_STARTED;

const inputKeys = document.querySelector("#input-keys");

/**
 * @type {HTMLElement}
 */
const gameBoard = document.querySelector("#game-board");

/**
 * @type {HTMLElement}
 */
const dummyBoard = document.querySelector("#dummy-board");
const errorElement = document.querySelector("#error-count");
const cellsCountElement = document.querySelector("#cells-count");
const timerElement = document.querySelector("#timer");

/**
 * @type {HTMLParagraphElement}
 */
const result = document.querySelector("#result");

/**
 * @type {HTMLButtonElement}
 */
const playButton = document.querySelector("#play-button");

/**
 * @type {HTMLDivElement}
 */
let selectedSquare = null;

/**
 * @type {HTMLDivElement}
 */
let selectedInput = null;

function changeGameToPlayingState() {
  playButton.innerText = "Pause";
  dummyBoard.classList.add("hide-element");
  gameBoard.classList.remove("hide-element");
  currentGameState = GameState.PLAYING;
}

function getTimer(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  if (formattedHours === "00") {
    return `${formattedMinutes}:${formattedSeconds}`;
  }
  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

function updateTimer() {
  setInterval(function () {
    if (currentGameState === GameState.PLAYING) {
      secondsElapsed++;
      const formattedTime = getTimer(secondsElapsed);
      timerElement.innerText = formattedTime;
    }
  }, 1000);
}

function getIndexofSelectedSquare() {
  const id = selectedSquare.id;
  const selectedRowCol = id.split("");
  const row = Number(selectedRowCol[0]);
  const col = Number(selectedRowCol[1]);
  return [row, col];
}

/**
 *
 * @param {boolean} mark
 */
function markOrUnmarkRelatedSquares(mark) {
  const id = selectedSquare.id;
  const [row, col] = getIndexofSelectedSquare();
  const relatedSquareIds = [];
  for (let i = 0; i < 9; i++) {
    const rowId = `${row}${i}`;
    const colId = `${i}${col}`;
    relatedSquareIds.push(rowId);
    relatedSquareIds.push(colId);
  }

  /* Mark/Unmark boxes in the same square  */
  const boxRowIdx = row - (row % 3);
  const colBoxIdx = col - (col % 3);
  for (let i = boxRowIdx; i < boxRowIdx + 3; i++) {
    for (let j = colBoxIdx; j < colBoxIdx + 3; j++) {
      const idx = `${i}${j}`;
      relatedSquareIds.push(idx);
    }
  }
  relatedSquareIds.forEach((relatedId) => {
    if (relatedId === id) return;
    if (mark) {
      document.getElementById(relatedId).classList.add("related-square");
    } else {
      document.getElementById(relatedId).classList.remove("related-square");
    }
  });
}

function clearSelectedSquare() {
  if (selectedSquare) {
    markOrUnmarkRelatedSquares(false);
    selectedSquare.classList.remove("selected-square");
  }
}

function checkGameCompleted() {
  if (errorCount === 3) {
    currentGameState = GameState.GAME_OVER;
    result.innerText = "Game Over. You Lost";
  } else if (filledSquares === 81) {
    cellsCountElement = GameState.GAME_WIN;
    result.innerText = "Game Over. You Win";
  }
}

/**
 *
 * @param {number} value
 */
function updateSelectedSquareValue(value) {
  if (currentGameState !== GameState.PLAYING) return;
  const [row, col] = getIndexofSelectedSquare();
  const questionKey = questionBoard[row][col];
  const answerKey = answerBoard[row][col];
  if (questionKey === 0 && progressBoard[row][col] !== value) {
    if (value !== 0) {
      selectedSquare.innerText = value;
      filledSquares++;
    } else {
      selectedSquare.innerText = "";
      filledSquares--;
    }
    progressBoard[row][col] = value;
    if (value !== 0 && answerKey !== value) {
      errorCount++;
      errorElement.innerText = errorCount;
      selectedSquare.classList.remove("answer-square");
      selectedSquare.classList.add("mistake-square");
    }
    if (answerKey === value) {
      selectedSquare.classList.remove("mistake-square");
      selectedSquare.classList.add("answer-square");
    }
    cellsCountElement.innerText = `${filledSquares}/${TOTAL_SQUARES}`;
  }
  checkGameCompleted();
}

function handleSquareClick() {
  clearSelectedSquare();
  selectedSquare = this;
  selectedSquare.classList.add("selected-square");
  markOrUnmarkRelatedSquares(true);
  // if (selectedInput) {
  //   updateSelectedSquareValue(selectedInput.innerText);
  // }
}

/**
 * @param {number[][]} board
 */
function drawBoard(board) {
  board.forEach((row, rowIdx) => {
    row.forEach((val, colIdx) => {
      const square = document.createElement("div");
      square.classList.add("square");
      square.classList.add("center-content");
      square.id = `${rowIdx}${colIdx}`;
      if (val !== 0) {
        square.classList.add("question-square");
        square.innerText = val;
        filledSquares++;
      } else {
        square.classList.add("answer-square");
      }
      if (rowIdx === 2 || rowIdx === 5) {
        square.classList.add("horizontal-border");
      }
      if (colIdx === 2 || colIdx === 5) {
        square.classList.add("vertical-border");
      }
      square.addEventListener("click", handleSquareClick);
      gameBoard.appendChild(square);
    });
  });
  cellsCountElement.innerText = `${filledSquares}/${TOTAL_SQUARES}`;
}

// /**
//  *
//  * @param {Event} e
//  */
// function handleInputClick(e) {
//   if (selectedInput === this) {
//     selectedInput.classList.remove("selected-input");
//     selectedInput = null;
//     return;
//   }
//   if (selectedInput) {
//     selectedInput.classList.remove("selected-input");
//   }
//   selectedInput = this;
//   selectedInput.classList.add("selected-input");
// }

function drawInputKeys() {
  for (let i = 1; i <= 9; i++) {
    const inputKey = document.createElement("div");
    inputKey.innerText = i;
    inputKey.classList.add("input-number");
    inputKey.classList.add("center-content");
    inputKey.id = `input-number-${i}`;
    inputKey.addEventListener("click", function () {
      updateSelectedSquareValue(i);
    });
    inputKeys.appendChild(inputKey);
  }
}

/**
 *
 * @param {string} newId
 */
function changeSelectedSquare(newId) {
  selectedSquare = document.getElementById(newId);
  selectedSquare.classList.add("selected-square");
  markOrUnmarkRelatedSquares(true);
}

function moveSelectedSquareToUp() {
  const [row, col] = getIndexofSelectedSquare();
  if (row === 0) return;
  const newId = `${row - 1}${col}`;
  clearSelectedSquare();
  changeSelectedSquare(newId);
}

function moveSelectedSquareToDown() {
  const [row, col] = getIndexofSelectedSquare();
  if (row === 8) return;
  const newId = `${row + 1}${col}`;
  clearSelectedSquare();
  changeSelectedSquare(newId);
}

function moveSelectedSquareToTheLeft() {
  const [row, col] = getIndexofSelectedSquare();
  if (col === 0) return;
  const newId = `${row}${col - 1}`;
  clearSelectedSquare();
  changeSelectedSquare(newId);
}

function moveSelectedSquareToTheRight() {
  const [row, col] = getIndexofSelectedSquare();
  if (col === 8) return;
  const newId = `${row}${col + 1}`;
  clearSelectedSquare();
  changeSelectedSquare(newId);
}

document.addEventListener("keydown", function (e) {
  if (currentGameState !== GameState.PLAYING) return;
  switch (e.key) {
    case "ArrowLeft":
      moveSelectedSquareToTheLeft();
      break;
    case "ArrowRight":
      moveSelectedSquareToTheRight();
      break;
    case "ArrowUp":
      moveSelectedSquareToUp();
      break;
    case "ArrowDown":
      moveSelectedSquareToDown();
      break;
    default:
      break;
  }
});

document.addEventListener("keyup", function (e) {
  if (currentGameState !== GameState.PLAYING) return;
  if (e.key === "Backspace" || e.key === "Delete") {
    updateSelectedSquareValue(0);
    return;
  }
  const inputNumber = Number(e.key);
  if (isNaN(inputNumber)) return;
  if (inputNumber >= 1 && inputNumber <= 9) {
    updateSelectedSquareValue(inputNumber);
  }
});

playButton.addEventListener("click", function () {
  const buttonText = playButton.innerText;
  if (currentGameState === GameState.NOT_STARTED) {
    drawBoard(progressBoard);
    changeSelectedSquare("00");
    changeGameToPlayingState();
  }
  if (buttonText === "Play" && currentGameState === GameState.PAUSED) {
    changeGameToPlayingState();
  }
  if (buttonText === "Pause" && currentGameState === GameState.PLAYING) {
    currentGameState = GameState.PAUSED;
    playButton.innerText = "Play";
    dummyBoard.classList.remove("hide-element");
    gameBoard.classList.add("hide-element");
  }
});

window.addEventListener("load", function () {
  drawInputKeys();
  updateTimer();
  cellsCountElement.innerText = `${filledSquares}/${TOTAL_SQUARES}`;
});
