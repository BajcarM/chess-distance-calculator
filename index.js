const gameboard = document.querySelector(".gameboard");
const movesArrayHorse = [
  ["+2", "+1"],
  ["+2", "-1"],
  ["+1", "+2"],
  ["-1", "+2"],
  ["-2", "+1"],
  ["-2", "-1"],
  ["-1", "-2"],
  ["+1", "-2"],
];

let selectedFigure = movesArrayHorse;
let position = "";

createGameboard(8, 8);

gameboard.addEventListener("click", (e) => {
  position = e.target.dataset.coords;
  gameboard
    .querySelectorAll(".tile")
    .forEach((tile) => (tile.textContent = ""));
  e.target.textContent = "0";
  checkPossibleMoves(position, selectedFigure);
});

function createGameboard(rows, cols) {
  // Create a board

  gameboard.innerHTML = "";
  let tiles = [];
  for (i = 0; i < rows; i++) {
    for (j = 0; j < cols; j++) {
      tiles.push(
        `<div class="tile tile-empty tile-black" data-coords="${i}${j}"></div>`
      );
    }
  }
  gameboard.innerHTML = tiles.join("");

  // Color tiles

  document.querySelectorAll(".tile").forEach((tile) => {
    const row = parseInt(tile.dataset.coords[0]);
    const col = parseInt(tile.dataset.coords[1]);
    if ((row % 2 && col % 2) || (!(row % 2) && !(col % 2))) {
      tile.classList.remove("tile-black");
      tile.classList.add("tile-white");
    }
  });
}

function checkPossibleMoves(coords, movesArray) {
  let currentStep = [coords];
  let nextStep = [];
  stepCount = "1";
  do {
    for (i = 0; i < currentStep.length; i++) {
      const row = parseInt(currentStep[i][0]);
      const col = parseInt(currentStep[i][1]);

      possibleMovesCoords = movesArray.reduce((acc, item) => {
        acc.push(`${row + parseInt(item[0])}${col + parseInt(item[1])}`);
        return acc;
      }, []);

      for (j = 0; j < possibleMovesCoords.length; j++) {
        const possibleMove = document.querySelector(
          `[data-coords="${possibleMovesCoords[j]}"]`
        );
        if (possibleMove && possibleMove.textContent.length === 0) {
          nextStep.push(possibleMovesCoords[j]);
          possibleMove.textContent = stepCount;
        }
      }
    }

    currentStep = nextStep;
    nextStep = [];
    stepCount++;
  } while (currentStep.length > 0);
}

