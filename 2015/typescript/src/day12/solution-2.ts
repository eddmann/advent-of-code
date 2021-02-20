import { toInt } from '../helpers';

export const part1 = (input: string): number =>
  (input.match(/(-?\d)+/g) || []).reduce((sum, val) => sum + toInt(val), 0);

export const part2 = (input: string): number =>
  part1(
    JSON.stringify(
      JSON.parse(input, (_, value) =>
        typeof value === 'object' && !Array.isArray(value) && Object.values(value).includes('red') ? '' : value,
      ),
    ),
  );
