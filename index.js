const gameboard = document.querySelector(".gameboard");
const figuresContainer = document.querySelector(".figures-container");
const lettersArray = "abcdefghijklmnopqrstuvwxyz".split("");

const figures = [
  {
    name: "pawn",
    moves: function () {
      return [["-1", "0"]];
    },
  },
  {
    name: "bishop",
    moves: function () {
      const bishop = [];
      for (i = -(boardSize - 1); i < boardSize; i++) {
        bishop.push([i, i], [i, -i]);
      }
      return bishop;
    },
  },
  {
    name: "knight",
    moves: function () {
      const knight = [];
      for (i = -1; i < 2; i += 2) {
        for (j = -1; j < 2; j += 2) {
          knight.push([2 * j, i], [i, 2 * j]);
        }
      }

      return knight;
    },
  },
  {
    name: "rook",
    moves: function () {
      const rook = [];
      for (i = -(boardSize - 1); i < boardSize; i++) {
        rook.push(["0", i], [i, "0"]);
      }
      return rook;
    },
  },
  {
    name: "queen",
    moves: function () {
      const queen = [];
      for (i = -(boardSize - 1); i < boardSize; i++) {
        queen.push([i, i], [i, -i], ["0", i], [i, "0"]);
      }
      return queen;
    },
  },
  {
    name: "king",
    moves: function () {
      const king = [];
      for (i = -1; i < 2; i++) {
        for (j = -1; j < 2; j++) {
          king.push([i, j]);
        }
      }

      return king;
    },
  },
];

let boardSize = 8;
let selectedFigure = null;
let position = "";

createGameboard(boardSize, boardSize);
createFigures();

gameboard.addEventListener("click", (e) => {
  if (!selectedFigure) {
    document.querySelector(".modal").style.display = "grid";
    setTimeout(() => {
      document.querySelector(".modal").style.display = "none";
    }, 2000);
    return;
  }
  position = [e.target.dataset.row, e.target.dataset.col];
  gameboard.querySelectorAll(".tile").forEach((tile) => {
    tile.textContent = "";
    tile.classList.remove(`tile-selected`, `figure-${selectedFigure.name}`);
  });

  e.target.innerHTML = "&middot;";
  e.target.classList.add(`tile-selected`, `figure-${selectedFigure.name}`);

  checkPossibleMoves(position[0], position[1], selectedFigure.moves());
});

figuresContainer.addEventListener("click", (e) => {
  const closestFigureContainer = e.target.closest(".figure-container");
  gameboard.querySelectorAll(".tile").forEach((tile) => {
    tile.textContent = "";
    if (selectedFigure) {
      tile.classList.remove(`figure-selected`, `figure-${selectedFigure.name}`);
    }
  });
  if (closestFigureContainer.classList.contains("figure-selected")) {
    closestFigureContainer.classList.remove("figure-selected");
    selectedFigure = null;
  } else {
    figuresContainer
      .querySelectorAll(".figure-container")
      .forEach((element) => {
        element.classList.remove("figure-selected");
      });

    closestFigureContainer.classList.add("figure-selected");
    selectedFigure = figures[closestFigureContainer.dataset.index];
  }
});

function createGameboard(rows, cols) {
  gameboard.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;
  document.querySelector(
    ".coords-numbers-container"
  ).style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;
  gameboard.innerHTML = "";
  let tiles = [];
  let tileColors = ["white", "black"];
  for (i = 0; i < rows; i++) {
    for (j = 0; j < cols; j++) {
      tiles.push(
        `<div class="tile tile-empty tile-${
          tileColors[(i + j) % 2]
        }" data-row="${i}" data-col="${j}"></div>`
      );
    }
  }
  gameboard.innerHTML = tiles.join("");

  // Create coordinates on the sides

  coordsArray = [""];

  do {
    let bufferArray = [];
    for (i = 0; i < lettersArray.length; i++) {
      for (j = 0; j < coordsArray.length; j++) {
        bufferArray.push(lettersArray[i] + coordsArray[j]);
      }
    }
    coordsArray = bufferArray;
  } while (coordsArray.length < boardSize);

  let containerNumbers = [];
  let containerLetters = [];

  for (i = 0; i < boardSize; i++) {
    containerNumbers.push(`<div class="coord">${i + 1}</div>`);
    containerLetters.push(`<div class="coord">${coordsArray[i]}</div>`);
  }
  document.querySelector(".coords-numbers-container").innerHTML =
    containerNumbers.join("");
  document.querySelector(".coords-letters-container").innerHTML =
    containerLetters.join("");

  // Adjust the font size on tiles based on tile size

  document.querySelectorAll(".tile").forEach((tile) => {
    tile.style.fontSize = `${32 / boardSize}rem`;
  });
}

function createFigures() {
  let figuresArray = figures.reduce((acc, item, index) => {
    acc.push(
      `<div class="figure-container" data-index="${index}">
            <div class="figure figure-${item.name}"></div>
            <p>${item.name}</p>
        </div>`
    );
    return acc;
  }, []);

  document.querySelector(".figures-container").innerHTML =
    figuresArray.join("");
}

function checkPossibleMoves(coordsRow, coordsCol, movesArray) {
  let currentStep = [[coordsRow, coordsCol]];
  let nextStep = [];
  stepCount = "1";
  do {
    for (i = 0; i < currentStep.length; i++) {
      const row = parseInt(currentStep[i][0]);
      const col = parseInt(currentStep[i][1]);

      possibleMovesCoords = movesArray.reduce((acc, item) => {
        acc.push([row + parseInt(item[0]), col + parseInt(item[1])]);
        return acc;
      }, []);

      for (j = 0; j < possibleMovesCoords.length; j++) {
        const possibleMove = document.querySelector(
          `[data-row="${possibleMovesCoords[j][0]}"][ data-col="${possibleMovesCoords[j][1]}"]`
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

document.querySelector(".btn-input").addEventListener("click", (e) => {
  e.preventDefault();
  if (document.querySelector(".input").value > 0) {
    boardSize = parseInt(document.querySelector(".input").value);
    selectedFigure = null;
    position = "";
    createGameboard(boardSize, boardSize);
    createFigures();
  }
});
