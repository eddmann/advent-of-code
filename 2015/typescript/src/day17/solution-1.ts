import { toInt, sum } from '../helpers';

const parseContainers = (input: string) => input.split('\n').map(toInt);

const subsetSum = (numbers: number[], target: number): number[][] => {
  const recur = (remaining: number[], subset: number[]): number[][] => {
    const total = subset.reduce(sum, 0);
    if (total === target) return [subset];
    if (total >= target) return [];
    return remaining.flatMap((n, i) => recur(remaining.slice(i + 1), [...subset, n]));
  };

  return recur(numbers, []);
};

export const part1 = (input: string): number => subsetSum(parseContainers(input), 150).length;

export const part2 = (input: string): number => {
  const sizes = subsetSum(parseContainers(input), 150).reduce(
    (sizes, subset) => sizes.set(subset.length, (sizes.get(subset.length) || 0) + 1),
    new Map<number, number>(),
  );

  return sizes.get(Math.min(...sizes.keys()));
};
