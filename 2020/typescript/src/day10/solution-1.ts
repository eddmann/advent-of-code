import { toInt } from '../helpers';

const parseAdapters = (input: string): number[] =>
  input
    .split('\n')
    .map(toInt)
    .sort((a, b) => a - b);

export const part1 = (input: string): number => {
  const adapters = parseAdapters(input);

  const { differences } = adapters.reduce(
    ({ differences, previous }, jolts) => ({
      differences: { ...differences, [jolts - previous]: differences[jolts - previous] + 1 },
      previous: jolts,
    }),
    { differences: { 1: 0, 3: 1 }, previous: 0 },
  );

  return differences[1] * differences[3];
};

// https://www.geeksforgeeks.org/tabulation-vs-memoization/

export const part2 = (input: string): number => {
  const adapters = parseAdapters(input);

  const jolts = [0, ...adapters, adapters[adapters.length - 1] + 3];
  const arrangements = [1, ...Array(jolts.length - 1).fill(0)];

  for (let i = 1; i < jolts.length; i++) {
    for (let j = 0; j < i; j++) {
      if (jolts[i] - jolts[j] < 4) {
        arrangements[i] += arrangements[j];
      }
    }
  }

  return arrangements[arrangements.length - 1];
};
