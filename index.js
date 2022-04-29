const gameboard = document.querySelector(".gameboard");
const figuresContainer = document.querySelector(".figures-container");

const figures = [
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
    name: "pawn",
    moves: function () {
      return [["-1", "0"]];
    },
  },
  {
    name: "rook",
    moves: function () {
      const rook = [];
      for (i = -7; i < 8; i++) {
        rook.push(["0", i], [i, "0"]);
      }
      return rook;
    },
  },
  {
    name: "bishop",
    moves: function () {
      const bishop = [];
      for (i = -7; i < 8; i++) {
        bishop.push([i, i], [i, -i]);
      }
      return bishop;
    },
  },
  {
    name: "queen",
    moves: function () {
      const queen = [];
      for (i = -7; i < 8; i++) {
        queen.push([i, i], [i, -i], ["0", i], [i, "0"]);
      }
      return queen;
    },
  },
];

let selectedFigure = null;
let position = "";

createGameboard(8, 8);
createFigures();

gameboard.addEventListener("click", (e) => {
  if (!selectedFigure) {
    document.querySelector(".modal").style.display = "grid";
    setTimeout(() => {
      document.querySelector(".modal").style.display = "none";
    }, 2000);
    return;
  }
  position = e.target.dataset.coords;
  gameboard.querySelectorAll(".tile").forEach((tile) => {
    tile.textContent = "";
    tile.classList.remove(`tile-selected`, `figure-${selectedFigure.name}`);
  });

  e.target.textContent = "0";
  e.target.classList.add(`tile-selected`, `figure-${selectedFigure.name}`);

  checkPossibleMoves(position, selectedFigure.moves());
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
  gameboard.innerHTML = "";
  let tiles = [];
  let tileColors = ["white", "black"];
  for (i = 0; i < rows; i++) {
    for (j = 0; j < cols; j++) {
      tiles.push(
        `<div class="tile tile-empty tile-${
          tileColors[(i + j) % 2]
        }" data-coords="${i}${j}"></div>`
      );
    }
  }
  gameboard.innerHTML = tiles.join("");
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
