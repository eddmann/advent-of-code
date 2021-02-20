import { toInt, sum, product } from '../helpers';

type PresentDimensions = [length: number, width: number, height: number];

const parsePresentDimensions = (input: string): PresentDimensions[] =>
  input.split('\n').map(line => line.split('x').map(toInt) as PresentDimensions);

export const part2 = (input: string): number =>
  parsePresentDimensions(input)
    .map(d => 2 * (d.reduce(sum) - Math.max(...d)) + d.reduce(product))
    .reduce(sum);
