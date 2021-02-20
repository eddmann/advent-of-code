import { sum } from '../helpers';

const sumJsonNumbers = (x: any, isSkipped = (_: any) => false): number => {
  if (isSkipped(x)) {
    return 0;
  }

  if (typeof x === 'number') {
    return x;
  }

  if (typeof x === 'object') {
    return Object.values(x)
      .map(y => sumJsonNumbers(y, isSkipped))
      .reduce(sum, 0);
  }

  return 0;
};

export const part1 = (input: string): number => sumJsonNumbers(JSON.parse(input));

export const part2 = (input: string): number =>
  sumJsonNumbers(
    JSON.parse(input),
    x => typeof x === 'object' && !Array.isArray(x) && Object.values(x).includes('red'),
  );
