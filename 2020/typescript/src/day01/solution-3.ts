import { toInt, combinations } from '../helpers';

const parseReport = (input: string): number[] => input.split('\n').map(toInt);

export const part1 = (input: string): number | null => {
  const report = parseReport(input);

  for (const [number1, number2] of combinations(report, 2)) {
    if (number1 + number2 === 2020) {
      return number1 * number2;
    }
  }

  return null;
};

export const part2 = (input: string): number | null => {
  const report = parseReport(input);

  for (const [number1, number2, number3] of combinations(report, 3)) {
    if (number1 + number2 + number3 === 2020) {
      return number1 * number2 * number3;
    }
  }

  return null;
};
