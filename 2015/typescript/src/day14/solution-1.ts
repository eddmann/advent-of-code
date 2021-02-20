import { toInt } from '../helpers';

type Reindeer = {
  speed: number;
  fly: number;
  rest: number;
};

const parseReindeer = (input: string): Reindeer[] =>
  input.split('\n').map(line => {
    const [speed, fly, rest] = line.match(/(\d+)/g).map(toInt);
    return { speed, fly, rest };
  });

const simulate = ({ speed, fly, rest }: Reindeer, seconds: number): number => {
  const [quotient, remainder] = [Math.floor(seconds / (fly + rest)), seconds % (fly + rest)];
  return (quotient * fly + Math.min(remainder, fly)) * speed;
};

export const part1 = (input: string): number => Math.max(...parseReindeer(input).map(r => simulate(r, 2503)));

export const part2 = (input: string): number => {
  const reindeer = parseReindeer(input);

  const points = [...Array(2503).keys()].reduce((points, seconds) => {
    const distances = reindeer.map(r => simulate(r, seconds + 1));
    const winner = distances.indexOf(Math.max(...distances));
    return points.set(winner, (points.get(winner) || 0) + 1);
  }, new Map<number, number>());

  return Math.max(...points.values());
};
