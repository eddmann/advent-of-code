import { toInt } from '../helpers';

const parseReport = (input: string): number[] => input.split('\n').map(toInt);

export const part1 = (input: string): number | null => {
  const report = parseReport(input);

  for (let i = 0; i < report.length - 1; i++) {
    for (let j = i + 1; j < report.length; j++) {
      if (report[i] + report[j] === 2020) {
        return report[i] * report[j];
      }
    }
  }

  return null;
};

export const part2 = (input: string): number | null => {
  const report = parseReport(input);

  for (let i = 0; i < report.length - 2; i++) {
    for (let j = i + 1; j < report.length - 1; j++) {
      for (let k = j + 1; k < report.length; k++) {
        if (report[i] + report[j] + report[k] === 2020) {
          return report[i] * report[j] * report[k];
        }
      }
    }
  }

  return null;
};
