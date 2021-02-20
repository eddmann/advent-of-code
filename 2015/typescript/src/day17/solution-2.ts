import { toInt, sum } from '../helpers';

const parseContainers = (input: string) => input.split('\n').map(toInt);

function* subsetSum(numbers: number[], target: number): Generator<number[]> {
  function* recur(remaining: number[], subset: number[]): Generator<number[]> {
    const total = subset.reduce(sum, 0);
    if (total === target) yield subset;
    if (total >= target) return;
    for (let i = 0; i < remaining.length; i++) {
      yield* recur(remaining.slice(i + 1), [...subset, remaining[i]]);
    }
  }

  yield* recur(numbers, []);
}

export const part1 = (input: string): number => [...subsetSum(parseContainers(input), 150)].length;

export const part2 = (input: string): number => {
  const sizes = [...subsetSum(parseContainers(input), 150)].reduce(
    (sizes, subset) => sizes.set(subset.length, (sizes.get(subset.length) || 0) + 1),
    new Map<number, number>(),
  );

  return sizes.get(Math.min(...sizes.keys()));
};
