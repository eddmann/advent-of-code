import { toInt, MapSet } from '../helpers';

type BorderlessPhoto = string[][];
type Position = [number, number];

class Tile {
  constructor(readonly id: number, readonly grid: string[][]) {}

  flipVertical() {
    const newGrid = Array<string>(this.grid[0].length)
      .fill('')
      .map(() => Array<string>(this.grid.length).fill(''));

    for (let row = 0; row < this.grid.length / 2; row++) {
      newGrid[row] = this.grid[this.grid.length - row - 1];
      newGrid[this.grid.length - row - 1] = this.grid[row];
    }

    return new Tile(this.id, newGrid);
  }

  rotateClockwise() {
    const newGrid = Array<string>(this.grid[0].length)
      .fill('')
      .map(() => Array<string>(this.grid.length).fill(''));

    for (let col = 0; col < this.grid[0].length; col++) {
      for (let row = 0; row < this.grid.length; row++) {
        newGrid[col][this.grid.length - row - 1] = this.grid[row][col];
      }
    }

    return new Tile(this.id, newGrid);
  }

  private get topBorder() {
    return this.grid[0].join('');
  }

  private get bottomBorder() {
    return this.grid[this.grid.length - 1].join('');
  }

  private get rightBorder() {
    return this.grid.map(row => row[row.length - 1]).join('');
  }

  private get leftBorder() {
    return this.grid.map(row => row[0]).join('');
  }

  isBottomMatch(that: this) {
    return that.bottomBorder === this.topBorder;
  }

  isSideMatch(that: this) {
    return that.rightBorder === this.leftBorder;
  }

  static fromString(str: string) {
    const [, id, tile] = str.trim().match(/Tile (\d+):\n([\s\S]+)/m);

    return new Tile(
      toInt(id),
      tile.split('\n').map(row => row.split('')),
    );
  }

  static *transforms(tile: Tile): Generator<Tile> {
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

const parseTiles = (input: string): Tile[] => input.split('\n\n').map(Tile.fromString);

const buildPhotoFromTiles = (tiles: Tile[]): Tile[][] | undefined => {
  const usedTiles = new Set<number>();
  const photo = Array<Tile>(Math.floor(tiles.length ** 0.5))
    .fill(undefined)
    .map(() => Array<Tile>(Math.floor(tiles.length ** 0.5)).fill(undefined));

  const isFit = (tile: Tile, row: number, col: number): boolean => {
    return (
      (row === 0 || tile.isBottomMatch(photo[row - 1][col])) && (col === 0 || tile.isSideMatch(photo[row][col - 1]))
    );
  };

  const doFind = (row: number, col: number): boolean => {
    if (col === photo[0].length) {
      col = 0;
      row++;
    }

    if (row === photo.length) {
      return true;
    }

    for (let x = 0; x < tiles.length; x++) {
      if (usedTiles.has(tiles[x].id)) continue;

      for (let tile of Tile.transforms(tiles[x])) {
        if (isFit(tile, row, col)) {
          usedTiles.add(tiles[x].id);
          photo[row][col] = tile;

          if (doFind(row, col + 1)) {
            return true;
          }
        }
      }

      usedTiles.delete(tiles[x].id);
    }

    photo[row][col] = undefined;

    return false;
  };

  return doFind(0, 0) ? photo : undefined;
};

const productOfCorners = (photo: Tile[][]): number => {
  return (
    photo[0][0].id *
    photo[0][photo[0].length - 1].id *
    photo[photo.length - 1][0].id *
    photo[photo.length - 1][photo[0].length - 1].id
  );
};

const toBorderlessPhoto = (photo: Tile[][]): BorderlessPhoto => {
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

const calcWaterRoughness = (monster: Tile, photo: Tile[][]): number => {
  const grid = toBorderlessPhoto(photo);
  const totalHashes = grid.reduce((acc, row) => acc + row.filter(col => col === '#').length, 0);
  const monsterHashes = [...Tile.transforms(monster)].reduce(
    (hashes, monster) => new MapSet([...hashes, ...findMonsterHashes(monster, grid)]),
    new MapSet<Position>(),
  );

  return totalHashes - monsterHashes.size;
};

const findMonsterHashes = (monster: Tile, grid: BorderlessPhoto): MapSet<Position> => {
  let hashes = new MapSet<Position>();

  for (let row = 0; row < grid.length - monster.grid.length + 1; row++) {
    for (let col = 0; col < grid[row].length - monster.grid[0].length + 1; col++) {
      hashes = new MapSet<Position>([...hashes, ...findMonsterHashesAt(monster, grid, row, col)]);
    }
  }

  return hashes;
};

const findMonsterHashesAt = (monster: Tile, grid: BorderlessPhoto, rowG: number, colG: number): MapSet<Position> => {
  const hashes = new MapSet<Position>();

  for (let rowM = 0; rowM < monster.grid.length; rowM++) {
    for (let colM = 0; colM < monster.grid[0].length; colM++) {
      if (monster.grid[rowM][colM] === '#') {
        if (grid[rowG + rowM][colG + colM] === '.') {
          return new MapSet<Position>();
        }
        hashes.add([rowG + rowM, colG + colM]);
      }
    }
  }

  return hashes;
};

export const part1 = (input: string): number => {
  const tiles = parseTiles(input);
  const photo = buildPhotoFromTiles(tiles);

  return productOfCorners(photo);
};

export const part2 = (input: string): number => {
  const tiles = parseTiles(input);
  const photo = buildPhotoFromTiles(tiles);

  return calcWaterRoughness(
    Tile.fromString(`Tile 0:\n                  # \n#    ##    ##    ###\n #  #  #  #  #  #   `),
    photo,
  );
};
