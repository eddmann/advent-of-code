const toSetValue = (arr) => arr.toString();
const fromSetValue = (str) => str.split(",").map(Number);

const positions = {
  e: [1, -1, 0],
  se: [0, -1, 1],
  sw: [-1, 0, 1],
  w: [-1, 1, 0],
  nw: [0, 1, -1],
  ne: [1, 0, -1],
};

const toGridPosition = (location) =>
  location
    .match(new RegExp(`(${Object.keys(positions).join("|")})`, "g"))
    .map((direction) => positions[direction])
    .reduce(([x, y, z], [dx, dy, dz]) => [x + dx, y + dy, z + dz], [0, 0, 0]);

const generateBlackTileGrid = (tileLocations) =>
  tileLocations.reduce((tiles, location) => {
    const tile = toSetValue(toGridPosition(location));
    return tiles[tiles.has(tile) ? "delete" : "add"](tile) && tiles;
  }, new Set());

const getAdjacentTiles = ([x, y, z]) =>
  Object.values(positions).map(([dx, dy, dz]) => [x + dx, y + dy, z + dz]);

const dailyFlip = (blackTiles) => {
  const tilesAndNeighbours = [...blackTiles]
    .map(fromSetValue)
    .reduce((tiles, tile) => [...tiles, tile, ...getAdjacentTiles(tile)], []);

  return new Set(
    tilesAndNeighbours
      .filter((tile) => {
        const isBlackTile = blackTiles.has(toSetValue(tile));
        const totalAdjacentBlackTiles = getAdjacentTiles(tile).reduce(
          (count, neighbour) => count + blackTiles.has(toSetValue(neighbour)),
          0
        );

        if (!isBlackTile && totalAdjacentBlackTiles === 2) {
          return true;
        }

        if (
          isBlackTile &&
          (totalAdjacentBlackTiles === 0 || totalAdjacentBlackTiles > 2)
        ) {
          return false;
        }

        return isBlackTile;
      })
      .map(toSetValue)
  );
};

const part1 = (tileLocations) => generateBlackTileGrid(tileLocations).size;
const part2 = (tileLocations, days = 100) =>
  [...Array(days)].reduce(dailyFlip, generateBlackTileGrid(tileLocations)).size;

const tileLocations = require("fs")
  .readFileSync(process.argv[2], "utf-8")
  .split("\n");

console.log(part1(tileLocations));
console.log(part2(tileLocations));
