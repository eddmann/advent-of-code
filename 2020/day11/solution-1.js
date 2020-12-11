const fs = require("fs");

const isEqualGrid = (gridA, gridB) => {
  for (let row = 0; row < gridA.length; row++) {
    for (let col = 0; col < gridA[0].length; col++) {
      if (gridA[row][col] !== gridB[row][col]) {
        return false;
      }
    }
  }

  return true;
};

const cloneGrid = (grid) => grid.map((cols) => [...cols]);

const countOccupiedSeats = (grid, row, col, isCheckNextSeat) => {
  let count = 0;

  for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
    for (let colOffset = -1; colOffset <= 1; colOffset++) {
      if (rowOffset === 0 && colOffset === 0) continue;

      let currRow = row + rowOffset;
      let currCol = col + colOffset;

      while (
        currRow >= 0 &&
        currCol >= 0 &&
        currRow < grid.length &&
        currCol < grid[0].length
      ) {
        if (grid[currRow][currCol] === "#") {
          count++;
          break;
        }

        if (grid[currRow][currCol] === "L") {
          break;
        }

        if (!isCheckNextSeat) break;

        currRow += rowOffset;
        currCol += colOffset;
      }
    }
  }

  return count;
};

const generateNextGrid = (grid, minOccupiedSeats, isCheckNextSeat) => {
  const outputGrid = cloneGrid(grid);

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      let occupiedSeats = countOccupiedSeats(grid, row, col, isCheckNextSeat);
      let seat = grid[row][col];

      if (seat === "L" && occupiedSeats === 0) {
        outputGrid[row][col] = "#";
      } else if (seat === "#" && occupiedSeats > minOccupiedSeats) {
        outputGrid[row][col] = "L";
      }
    }
  }

  return outputGrid;
};

const part1 = (grid) => {
  let prev = grid;
  let next;

  while (true) {
    next = generateNextGrid(prev, 3, false);
    if (isEqualGrid(next, prev)) break;
    prev = next;
  }

  return prev.flat().filter((seat) => seat === "#").length;
};

const part2 = (grid) => {
  let prev = grid;
  let next;

  while (true) {
    next = generateNextGrid(prev, 4, true);
    if (isEqualGrid(next, prev)) break;
    prev = next;
  }

  return prev.flat().filter((seat) => seat === "#").length;
};

const grid = fs
  .readFileSync("./input.txt", "utf-8")
  .split("\n")
  .map((x) => x.split(""));

console.log(part1(grid));
console.log(part2(grid));
