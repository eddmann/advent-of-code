import { toInt } from '../helpers';

const parseAdapters = (input: string): number[] =>
  input
    .split('\n')
    .map(toInt)
    .sort((a, b) => a - b);

export const part1 = (input: string): number => {
  const adapters = parseAdapters(input);

  const offset = [...adapters, adapters[adapters.length - 1] + 3];
  const differences = [0, ...adapters]
    .map((current, idx) => offset[idx] - current)
    .reduce((map, x) => map.set(x, (map.get(x) || 0) + 1), new Map<number, number>());

  return differences.get(1) * differences.get(3);
};

// https://brilliant.org/wiki/tribonacci-sequence/

export const part2 = (input: string): number => {
  const adapters = parseAdapters(input);

  const jolts = [0, ...adapters, adapters[adapters.length - 1] + 3];
  const tribonacci = [1, 1, 2, 4, 7];

  const { arrangements } = jolts.reduce(
    ({ arrangements, idx }, adapter) =>
      jolts.includes(adapter + 1)
        ? { arrangements, idx: idx + 1 }
        : { arrangements: arrangements * tribonacci[idx], idx: 0 },
    { arrangements: 1, idx: 0 },
  );

  return arrangements;
};
