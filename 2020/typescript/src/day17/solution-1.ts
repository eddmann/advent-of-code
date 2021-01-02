import { MapSet, cartesianProduct, repeat } from '../helpers';

type Cube = number[];
type ActiveCubes = MapSet<Cube>;

const parsePocketDimension = (input: string, dimensions: number): ActiveCubes =>
  input.split('\n').reduce((active, row, x) => {
    return row.split('').reduce((active, cube, y) => {
      return cube === '#' ? active.add([x, y, ...Array(dimensions - 2).fill(0)]) : active;
    }, active);
  }, new MapSet<Cube>());

const neighboursFor = (cube: Cube): Cube[] =>
  cartesianProduct(...Array(cube.length).fill([-1, 0, 1]))
    .filter(neighbour => !neighbour.every(cordinate => cordinate === 0))
    .map(neighbour => cube.map((cordinate, idx) => cordinate + neighbour[idx]));

const bootCycle = (active: ActiveCubes): ActiveCubes => {
  const activeWithNeighbours = new MapSet(
    [...active].reduce((active: Cube[], cube) => [...active, cube, ...neighboursFor(cube)], []),
  );

  return new MapSet(
    [...activeWithNeighbours].filter(cube => {
      const totalActiveNeighbours = neighboursFor(cube).reduce(
        (total, neighbour) => (active.has(neighbour) ? total + 1 : total),
        0,
      );

      if (totalActiveNeighbours === 3) return true;
      if (totalActiveNeighbours === 2 && active.has(cube)) return true;
      return false;
    }),
  );
};

export const part1 = (input: string): number => repeat(6, bootCycle, parsePocketDimension(input, 3)).size;

export const part2 = (input: string): number => repeat(6, bootCycle, parsePocketDimension(input, 4)).size;
