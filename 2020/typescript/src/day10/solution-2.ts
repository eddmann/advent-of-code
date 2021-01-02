import { toInt } from '../helpers';

const parseAdapters = (input: string): number[] =>
  input
    .split('\n')
    .map(toInt)
    .sort((a, b) => a - b);

function* takeWhile<T>(xs: T[], fn: (x: T) => boolean): Generator<T> {
  for (let x of xs) {
    if (fn(x)) yield x;
    else break;
  }
}

const memoize = (fn: Function) => {
  const cache = new Map();

  return (...args: any[]): any => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

const countArrangements = memoize((adapters: number[], total: number): number => {
  if (adapters.length === 0) {
    return 1;
  }

  return [...takeWhile(adapters, x => x - total < 4)].reduce(
    (acc, x) =>
      acc +
      countArrangements(
        adapters.filter(y => y > x),
        x,
      ),
    0,
  );
});

export const part1 = (input: string): number => {
  const adapters = parseAdapters(input);

  const offset = [...adapters, adapters[adapters.length - 1] + 3];
  const differences = [0, ...adapters]
    .map((current, idx) => offset[idx] - current)
    .reduce((map, x) => map.set(x, (map.get(x) || 0) + 1), new Map<number, number>());

  return differences.get(1) * differences.get(3);
};

export const part2 = (input: string): number => countArrangements(parseAdapters(input), 0);
