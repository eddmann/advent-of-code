import { product } from '../helpers';

type Map = string[];

const parseMap = (input: string): Map => input.split('\n');

const countTrees = (map: Map, down: number, right: number): number => {
  let row = down;
  let col = right;
  let count = 0;

  while (row < map.length) {
    if (map[row][col] === '#') count++;
    col = (col + right) % map[0].length;
    row += down;
  }

  return count;
};

export const part1 = (input: string): number => countTrees(parseMap(input), 1, 3);

export const part2 = (input: string): number => {
  const map = parseMap(input);

  return [
    countTrees(map, 1, 1),
    countTrees(map, 1, 3),
    countTrees(map, 1, 5),
    countTrees(map, 1, 7),
    countTrees(map, 2, 1),
  ].reduce(product);
};
