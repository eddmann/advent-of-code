class Tile {
  constructor(id, grid) {
    this.id = id;
    this.grid = grid;
  }

  flipVertical() {
    const newGrid = Array(this.grid[0].length)
      .fill()
      .map(() => Array(this.grid.length).fill());

    for (let i = 0; i < this.grid.length / 2; i++) {
      newGrid[i] = this.grid[this.grid.length - i - 1];
      newGrid[this.grid.length - i - 1] = this.grid[i];
    }

    return new Tile(this.id, newGrid);
  }

  rotateClockwise() {
    const newGrid = Array(this.grid[0].length)
      .fill()
      .map(() => Array(this.grid.length).fill());

    for (let col = 0; col < this.grid[0].length; col++) {
      for (let row = 0; row < this.grid.length; row++) {
        newGrid[col][this.grid.length - row - 1] = this.grid[row][col];
      }
    }

    return new Tile(this.id, newGrid);
  }

  getId() {
    return this.id;
  }

  getTopBorder() {
    return this.grid[0].join("");
  }

  getBottomBorder() {
    return this.grid[this.grid.length - 1].join("");
  }

  getRightBorder() {
    return this.grid.map((row) => row[row.length - 1]).join("");
  }

  getLeftBorder() {
    return this.grid.map((row) => row[0]).join("");
  }

  isBottomMatch(that) {
    return that.getBottomBorder() === this.getTopBorder();
  }

  isSideMatch(that) {
    return that.getRightBorder() === this.getLeftBorder();
  }

  static fromString(str) {
    const [, id, tile] = str.trim().match(/Tile (\d+):\n([\s\S]+)/m);

    return new Tile(
      +id,
      tile.split("\n").map((col) => col.split(""))
    );
  }

  static *transforms(tile) {
    let flips = 2;
    while (flips--) {
      let rotations = 4;
      while (rotations--) {
        tile = tile.rotateClockwise();
        yield tile;
      }
      tile = tile.flipVertical();
    }
  }
}

const buildPhotoFromTiles = (tiles) => {
  const usedTiles = new Set();
  const photo = Array(Math.floor(tiles.length ** 0.5))
    .fill()
    .map(() => Array(Math.floor(tiles.length ** 0.5)).fill());

  const isFit = (tile, row, col) => {
    return (
      (row === 0 || tile.isBottomMatch(photo[row - 1][col])) &&
      (col === 0 || tile.isSideMatch(photo[row][col - 1]))
    );
  };

  const doFind = (row, col) => {
    if (col === photo[0].length) {
      col = 0;
      row++;
    }

    if (row === photo.length) {
      return true;
    }

    for (let x = 0; x < tiles.length; x++) {
      if (usedTiles.has(tiles[x].getId())) continue;

      for (let tile of Tile.transforms(tiles[x])) {
        if (isFit(tile, row, col)) {
          usedTiles.add(tiles[x].getId());
          photo[row][col] = tile;

          if (doFind(row, col + 1)) {
            return true;
          }
        }
      }

      usedTiles.delete(tiles[x].getId());
    }

    photo[row][col] = undefined;

    return false;
  };

  return doFind(0, 0) ? photo : undefined;
};

const productOfCorners = (photo) => {
  return (
    photo[0][0].getId() *
    photo[0][photo[0].length - 1].getId() *
    photo[photo.length - 1][0].getId() *
    photo[photo.length - 1][photo[0].length - 1].getId()
  );
};

const toBorderlessPhoto = (photo) => {
  const newPhoto = [];

  for (let row = 0; row < photo.length; row++) {
    for (let line = 1; line < photo[row][0].grid.length - 1; line++) {
      let newLine = [];
      for (let col = 0; col < photo[0].length; col++) {
        const tileLine = photo[row][col].grid[line];
        newLine.push(...tileLine.slice(1, tileLine.length - 1));
      }
      newPhoto.push(newLine);
    }
  }

  return newPhoto;
};

const calcWaterRoughness = (monster, photo) => {
  const grid = toBorderlessPhoto(photo);
  const totalHashes = grid.reduce(
    (acc, row) => acc + row.filter((col) => col === "#").length,
    0
  );
  const monsterHashes = [...Tile.transforms(monster)].reduce(
    (hashes, monster) =>
      new Set([...hashes, ...findMonsterHashes(monster, grid)]),
    new Set()
  );

  return totalHashes - monsterHashes.size;
};

const findMonsterHashes = (monster, grid) => {
  let hashes = new Set();

  for (let row = 0; row < grid.length - monster.grid.length + 1; row++) {
    for (
      let col = 0;
      col < grid[row].length - monster.grid[0].length + 1;
      col++
    ) {
      hashes = new Set([
        ...hashes,
        ...findMonsterHashesAt(monster, grid, row, col),
      ]);
    }
  }

  return hashes;
};

const findMonsterHashesAt = (monster, grid, rowG, colG) => {
  const hashes = new Set();

  for (let rowM = 0; rowM < monster.grid.length; rowM++) {
    for (let colM = 0; colM < monster.grid[0].length; colM++) {
      if (monster.grid[rowM][colM] === "#") {
        if (grid[rowG + rowM][colG + colM] === ".") {
          return new Set();
        }
        hashes.add([rowG + rowM, colG + colM]);
      }
    }
  }

  return hashes;
};

const tiles = require("fs")
  .readFileSync(process.argv[2], "utf-8")
  .split("\n\n")
  .map(Tile.fromString);

const part1 = productOfCorners;
const part2 = (photo) =>
  calcWaterRoughness(
    Tile.fromString(
      `Tile 0:\n                  # \n#    ##    ##    ###\n #  #  #  #  #  #   `
    ),
    photo
  );

const photo = buildPhotoFromTiles(tiles);
console.log(part1(photo));
console.log(part2(photo));
