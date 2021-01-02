import { intersection, union, sum } from '../helpers';

type Answer = string;

const parseGroups = (input: string): Set<Answer>[][] => input.split('\n\n').map(parseGroup);
const parseGroup = (input: string): Set<Answer>[] => input.split('\n').map(x => new Set(x));

export const part1 = (input: string): number =>
  parseGroups(input)
    .map(group => group.reduce(union).size)
    .reduce(sum);

export const part2 = (input: string): number =>
  parseGroups(input)
    .map(group => group.reduce(intersection).size)
    .reduce(sum);
