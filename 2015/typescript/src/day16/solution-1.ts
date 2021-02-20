import { toInt } from '../helpers';

type Aunt = { id: number; properties: { [name: string]: number } };
type Comparator = (value: number) => boolean;

const equalTo = (x: number): Comparator => (y: number) => x === y;
const lessThan = (x: number): Comparator => (y: number) => y < x;
const greaterThan = (x: number): Comparator => (y: number) => y > x;

const parseAunts = (input: string): Aunt[] =>
  input.split('\n').map(line => ({
    id: toInt(line.match(/\d+/)[0]),
    properties: Object.fromEntries([...line.matchAll(/(\w+): (\d+)/g)].map(([_, k, v]) => [k, toInt(v)])),
  }));

const findAuntWithReadings = (aunts: Aunt[], readings: { [name: string]: Comparator }): Aunt =>
  aunts.find(({ properties }) => Object.entries(properties).every(([k, v]) => readings[k](v)));

export const part1 = (input: string): number =>
  findAuntWithReadings(parseAunts(input), {
    children: equalTo(3),
    cats: equalTo(7),
    samoyeds: equalTo(2),
    pomeranians: equalTo(3),
    akitas: equalTo(0),
    vizslas: equalTo(0),
    goldfish: equalTo(5),
    trees: equalTo(3),
    cars: equalTo(2),
    perfumes: equalTo(1),
  }).id;

export const part2 = (input: string): number =>
  findAuntWithReadings(parseAunts(input), {
    children: equalTo(3),
    cats: greaterThan(7),
    samoyeds: equalTo(2),
    pomeranians: lessThan(3),
    akitas: equalTo(0),
    vizslas: equalTo(0),
    goldfish: lessThan(5),
    trees: greaterThan(3),
    cars: equalTo(2),
    perfumes: equalTo(1),
  }).id;
