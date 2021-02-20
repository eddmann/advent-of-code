import { combinations, sum, product, toInt } from '../helpers';

type Weight = number;
type Group = Weight[];

const parsePackageWeights = (input: string): Weight[] => input.split('\n').map(toInt);

const groupsOfWeight = function* (packages: Weight[], weightPerGroup: Weight): Generator<Group> {
  for (let groupSize = 1; groupSize <= packages.length; groupSize++) {
    for (const group of combinations(packages, groupSize)) {
      if (group.reduce(sum, 0) === weightPerGroup) {
        yield group;
      }
    }
  }
};

const sub = <T>(xs: T[], ys: T[]) => xs.filter(x => !ys.includes(x));

const canGroup = (packages: Weight[], numOfGroups: number, weightPerGroup: Weight): boolean => {
  if (numOfGroups === 0) return packages.length === 0;

  for (const group of groupsOfWeight(packages, weightPerGroup)) {
    if (canGroup(sub(packages, group), numOfGroups - 1, weightPerGroup)) {
      return true;
    }
  }

  return false;
};

const idealFirstGroupQE = (packages: Weight[], numOfGroups: number): number => {
  const weightPerGroup = packages.reduce(sum, 0) / numOfGroups;

  let minQE = Infinity;
  let prevGroupSize = Infinity;

  for (const group of groupsOfWeight(packages, weightPerGroup)) {
    if (minQE !== Infinity && prevGroupSize < group.length) break;

    const candidateQE = group.reduce(product, 1);
    if (candidateQE < minQE && canGroup(sub(packages, group), numOfGroups - 1, weightPerGroup)) {
      minQE = candidateQE;
    }

    prevGroupSize = group.length;
  }

  return minQE;
};

export const part1 = (input: string): number => idealFirstGroupQE(parsePackageWeights(input), 3);

export const part2 = (input: string): number => idealFirstGroupQE(parsePackageWeights(input), 4);
