import { toInt } from '../helpers';

const parseReport = (input: string): number[] => input.split('\n').map(toInt);

export const part1 = (input: string): number => {
  const expenseReport = parseReport(input);
  const seen = new Set<number>();

  for (const number of expenseReport) {
    const complement = 2020 - number;

    if (seen.has(complement)) {
      return number * complement;
    }

    seen.add(number);
  }

  return -1;
};

export const part2 = (input: string): number => {
  const expenseReport = parseReport(input);

  for (const [idx, number1] of expenseReport.entries()) {
    const seen = new Set<number>();

    for (const number2 of expenseReport.slice(idx + 1)) {
      const complement = 2020 - number1 - number2;

      if (seen.has(complement)) {
        return number1 * number2 * complement;
      }

      seen.add(number2);
    }
  }

  return -1;
};
