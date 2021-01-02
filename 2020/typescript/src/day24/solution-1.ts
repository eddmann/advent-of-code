import { MapSet, repeat } from '../helpers';

type Tile = [number, number, number];
type BlackTiles = MapSet<Tile>;

const parseTileLocations = (input: string) => input.split('\n');

const positions = {
  e: [1, -1, 0],
  se: [0, -1, 1],
  sw: [-1, 0, 1],
  w: [-1, 1, 0],
  nw: [0, 1, -1],
  ne: [1, 0, -1],
};

const toTile = (location: string): Tile =>
  location
    .match(new RegExp(`(${Object.keys(positions).join('|')})`, 'g'))
    .map(direction => positions[direction])
    .reduce(([x, y, z], [dx, dy, dz]) => [x + dx, y + dy, z + dz], [0, 0, 0]);

const neighboursFor = ([x, y, z]: Tile): Tile[] =>
  Object.values(positions).map(([dx, dy, dz]) => [x + dx, y + dy, z + dz]);

const generateBlackTiles = (locations: string[]): BlackTiles =>
  locations.reduce((tiles, location) => {
    const tile = toTile(location);
    return tiles[tiles.has(tile) ? 'delete' : 'add'](tile);
  }, new MapSet<Tile>());

const dailyFlip = (tiles: BlackTiles): BlackTiles => {
  const tilesWithNeighbours = new MapSet(
    [...tiles].reduce((tiles, tile) => [...tiles, tile, ...neighboursFor(tile)], []),
  );

  return new MapSet(
    [...tilesWithNeighbours].filter(tile => {
      const isBlackTile = tiles.has(tile);
      const totalAdjacentBlackTiles = neighboursFor(tile).reduce(
        (total, neighbour) => (tiles.has(neighbour) ? total + 1 : total),
        0,
      );

      if (!isBlackTile && totalAdjacentBlackTiles === 2) return true;
      if (isBlackTile && (totalAdjacentBlackTiles === 0 || totalAdjacentBlackTiles > 2)) return false;
      return isBlackTile;
    }),
  );
};

export const part1 = (input: string): number => generateBlackTiles(parseTileLocations(input)).size;

export const part2 = (input: string): number =>
  repeat(100, dailyFlip, generateBlackTiles(parseTileLocations(input))).size;
