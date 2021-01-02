import { toInt } from '../helpers';

const parseReport = (input: string): number[] => input.split('\n').map(toInt);

function* combinations<T>(arr: T[], size: number = arr.length): Generator<T[]> {
  const end = arr.length - 1;
  const combination = [];

  function* recur(start: number, index: number) {
    if (index === size) {
      return yield combination;
    }

    for (let i = start; i <= end && end - i + 1 >= size - index; i++) {
      combination[index] = arr[i];
      yield* recur(i + 1, index + 1);
    }
  }

  yield* recur(0, 0);
}

export const part1 = (input: string): number => {
  const expenseReport = parseReport(input);

  for (const [number1, number2] of combinations(expenseReport, 2)) {
    if (number1 + number2 === 2020) {
      return number1 * number2;
    }
  }

  return -1;
};

export const part2 = (input: string): number => {
  const expenseReport = parseReport(input);

  for (const [number1, number2, number3] of combinations(expenseReport, 3)) {
    if (number1 + number2 + number3 === 2020) {
      return number1 * number2 * number3;
    }
  }

  return -1;
};
