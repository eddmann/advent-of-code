import { CompoundSet } from '../helpers';

type Direction = typeof directions[number];
type Position = [x: number, y: number];

const directions = ['^', 'v', '<', '>'] as const;
const coordinates: { [K in Direction]: Position } = {
  '^': [1, 0],
  v: [-1, 0],
  '>': [0, 1],
  '<': [0, -1],
};

const parseDirections = (input: string): Direction[] =>
  [...input].filter((d: Direction): d is Direction => directions.includes(d));

const deliverPresents = (directions: Direction[]): CompoundSet<Position> => {
  let current: Position = [0, 0];
  const houses = new CompoundSet<Position>([current]);

  for (const direction of directions) {
    const [x, y] = current;
    const [dx, dy] = coordinates[direction];
    houses.add((current = [x + dx, y + dy]));
  }

  return houses;
};

export const part1 = (input: string): number => deliverPresents(parseDirections(input)).size;

export const part2 = (input: string): number => {
  const directions = parseDirections(input);

  const santa = directions.filter((_, i) => i % 2 === 0);
  const robot = directions.filter((_, i) => i % 2 === 1);

  return new CompoundSet([...deliverPresents(santa), ...deliverPresents(robot)]).size;
};
