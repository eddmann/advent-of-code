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

const idealFirstGroupQE = (packages: Weight[], numOfGroups: number): number => {
  const weightPerGroup = packages.reduce(sum, 0) / numOfGroups;

  for (const group of groupsOfWeight(packages, weightPerGroup)) {
    return group.reduce(product, 1);
  }
};

export const part1 = (input: string): number => idealFirstGroupQE(parsePackageWeights(input), 3);

export const part2 = (input: string): number => idealFirstGroupQE(parsePackageWeights(input), 4);
