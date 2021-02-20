import { toInt, sum, product } from '../helpers';

type PresentDimensions = [length: number, width: number, height: number];

const parsePresentDimensions = (input: string): PresentDimensions[] =>
  input.split('\n').map(line => line.split('x').map(toInt) as PresentDimensions);

export const part1 = (input: string): number =>
  parsePresentDimensions(input)
    .map(([l, w, h]) => {
      const area = [l * w, w * h, h * l];
      return 2 * area.reduce(sum) + Math.min(...area);
    })
    .reduce(sum);

export const part2 = (input: string): number =>
  parsePresentDimensions(input)
    .map(dimensions => {
      const [x, y] = dimensions.sort((a, b) => a - b);
      return 2 * (x + y) + dimensions.reduce(product);
    })
    .reduce(sum);
