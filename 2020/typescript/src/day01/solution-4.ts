import { toInt } from '../helpers';

const parseReport = (input: string): number[] => input.split('\n').map(toInt);

export const part1 = (input: string): number | null => {
  const report = parseReport(input);

  report.sort((a, b) => a - b);

  let lhs = 0;
  let rhs = report.length - 1;

  while (lhs < rhs) {
    const sum = report[lhs] + report[rhs];

    if (sum === 2020) {
      return report[lhs] * report[rhs];
    }

    if (sum < 2020) {
      lhs++;
    } else {
      rhs--;
    }
  }

  return null;
};

export const part2 = (input: string): number | null => {
  const report = parseReport(input);

  report.sort((a, b) => a - b);

  for (let i = 0; i < report.length - 2; i++) {
    let lhs = i + 1;
    let rhs = report.length - 1;

    while (lhs < rhs) {
      const sum = report[lhs] + report[i] + report[rhs];

      if (sum === 2020) {
        return report[lhs] * report[i] + report[rhs];
      }

      if (sum < 2020) {
        lhs++;
      } else {
        rhs--;
      }
    }
  }

  return null;
};
