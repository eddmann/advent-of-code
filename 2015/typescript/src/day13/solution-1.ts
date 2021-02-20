import { permutations, zip } from '../helpers';

type FamilyMember = string;
type Neighbours = string;
type Happiness = number;
type Relationships = { family: Set<FamilyMember>; relationships: Map<Neighbours, Happiness> };

const parseFamilyRelationships = (input: string): Relationships =>
  input.split('\n').reduce(
    ({ family, relationships }, line) => {
      const [, member, feeling, score, nextTo] = line.match(/(\w+) .+ (.+) (\d+) .+ (\w+)/);
      return {
        family: family.add(member),
        relationships: relationships.set(`${member},${nextTo}`, feeling === 'gain' ? +score : -score),
      };
    },
    { family: new Set<FamilyMember>(), relationships: new Map<Neighbours, Happiness>() },
  );

const calcSeatingHappiness = ({ family, relationships }: Relationships): Happiness[] =>
  [...permutations([...family])].map(a =>
    zip(a, [...a.slice(1), a[0]]).reduce(
      (score, [a, b]) => score + relationships.get(`${a},${b}`) + relationships.get(`${b},${a}`),
      0,
    ),
  );

const max = (xs: number[]) => xs.reduce((m, x) => (x > m ? x : m), -Infinity);

export const part1 = (input: string): number => max(calcSeatingHappiness(parseFamilyRelationships(input)));

export const part2 = (input: string): number => {
  const { family, relationships } = parseFamilyRelationships(input);

  const scores = calcSeatingHappiness({
    relationships: [...family].reduce(
      (relationships, member) => relationships.set(`Me,${member}`, 0).set(`${member},Me`, 0),
      relationships,
    ),
    family: family.add('Me'),
  });

  return max(scores);
};
