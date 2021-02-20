import { repeat, toInt } from '../helpers';

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

function* simulate({ speed, fly, rest }: Reindeer): Generator<number> {
  let elapsed = fly;
  let isFlying = true;
  let distance = 0;

  while (true) {
    if (elapsed < 1) {
      isFlying = !isFlying;
      elapsed = isFlying ? fly : rest;
    }

    if (isFlying) distance += speed;
    elapsed--;

    yield distance;
  }
}

const nth = <T>(g: Generator<T>, n: number): T => {
  for (const v of g) {
    if (--n < 1) return v;
  }
};

export const part1 = (input: string): number => Math.max(...parseReindeer(input).map(r => nth(simulate(r), 2503)));

export const part2 = (input: string): number => {
  const reindeer = parseReindeer(input).map(simulate);
  const points = new Map<number, number>();

  repeat(2503, () => {
    const distances = reindeer.map(g => g.next().value);
    const winner = distances.indexOf(Math.max(...distances));
    points.set(winner, (points.get(winner) || 0) + 1);
  });

  return Math.max(...points.values());
};
