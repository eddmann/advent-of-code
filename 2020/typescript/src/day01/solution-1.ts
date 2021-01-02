import { toInt } from '../helpers';

const parseReport = (input: string): number[] => input.split('\n').map(toInt);

export const part1 = (input: string): number => {
  const expenseReport = parseReport(input);

  for (let i = 0; i < expenseReport.length - 1; i++) {
    for (let j = i + 1; j < expenseReport.length; j++) {
      if (expenseReport[i] + expenseReport[j] === 2020) {
        return expenseReport[i] * expenseReport[j];
      }
    }
  }

  return -1;
};

export const part2 = (input: string): number => {
  const expenseReport = parseReport(input);

  for (let i = 0; i < expenseReport.length - 2; i++) {
    for (let j = i + 1; j < expenseReport.length - 1; j++) {
      for (let k = j + 1; k < expenseReport.length; k++) {
        if (expenseReport[i] + expenseReport[j] + expenseReport[k] === 2020) {
          return expenseReport[i] * expenseReport[j] * expenseReport[k];
        }
      }
    }
  }

  return -1;
};
