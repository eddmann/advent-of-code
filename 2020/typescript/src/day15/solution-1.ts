import { toInt } from '../helpers';

const parseNumbers = (input: string) => input.split(',').map(toInt);

function* sayNumber(numbers: number[]) {
  let turn = numbers.length;
  let number = numbers.pop();
  const occurrences = new Map(numbers.map((num, idx) => [num, idx + 1]));

  yield* numbers;

  while (true) {
    const next = turn - (occurrences.has(number) ? occurrences.get(number) : turn);
    occurrences.set(number, turn);
    yield number;
    number = next;
    turn += 1;
  }
}

const findNth = (col: Iterable<number>, nth: number): number => {
  let curr = 1;
  for (const number of col) {
    if (curr++ === nth) return number;
  }
};

export const part1 = (input: string): number => {
  const numbers = parseNumbers(input);

  return findNth(sayNumber(numbers), 2020);
};

export const part2 = (input: string): number => {
  const numbers = parseNumbers(input);

  return findNth(sayNumber(numbers), 30000000);
};
