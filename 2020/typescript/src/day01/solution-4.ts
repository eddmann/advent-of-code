import { toInt } from '../helpers';

const parseReport = (input: string): number[] => input.split('\n').map(toInt);

export const part1 = (input: string): number => {
  const expenseReport = parseReport(input);

  expenseReport.sort((a, b) => a - b);

  let lhs = 0;
  let rhs = expenseReport.length - 1;

  while (lhs < rhs) {
    const sum = expenseReport[lhs] + expenseReport[rhs];

    if (sum === 2020) {
      return expenseReport[lhs] * expenseReport[rhs];
    }

    if (sum < 2020) {
      lhs++;
    } else {
      rhs--;
    }
  }

  return -1;
};

export const part2 = (input: string): number => {
  const expenseReport = parseReport(input);

  expenseReport.sort((a, b) => a - b);

  for (let i = 0; i < expenseReport.length - 2; i++) {
    let lhs = i + 1;
    let rhs = expenseReport.length - 1;

    while (lhs < rhs) {
      const sum = expenseReport[lhs] + expenseReport[i] + expenseReport[rhs];

      if (sum === 2020) {
        return expenseReport[lhs] * expenseReport[i] + expenseReport[rhs];
      }

      if (sum < 2020) {
        lhs++;
      } else {
        rhs--;
      }
    }
  }

  return -1;
};
