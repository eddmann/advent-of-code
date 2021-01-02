import { toInt } from '../helpers';

const parseReport = (input: string): number[] => input.split('\n').map(toInt);

export const part1 = (input: string): number | null => {
  const report = parseReport(input);
  const seen = new Set<number>();

  for (const number of report) {
    const complement = 2020 - number;

    if (seen.has(complement)) {
      return number * complement;
    }

    seen.add(number);
  }

  return null;
};

export const part2 = (input: string): number | null => {
  const report = parseReport(input);

  for (let i = 0; i < report.length - 2; i++) {
    const seen = new Set<number>();

    for (let j = i + 1; j < report.length; j++) {
      const complement = 2020 - report[i] - report[j];

      if (seen.has(complement)) {
        return report[i] * report[j] * complement;
      }

      seen.add(report[j]);
    }
  }

  return null;
};
