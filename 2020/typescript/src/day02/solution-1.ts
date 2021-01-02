import { toInt } from '../helpers';

type Password = {
  num1: number;
  num2: number;
  char: string;
  password: string;
};

export const parsePasswordList = (input: string): Password[] =>
  input.split('\n').map(line => {
    const [, num1, num2, char, password] = line.match(/^(\d+)-(\d+) ([a-z]): ([a-z]+)$/);
    return { num1: toInt(num1), num2: toInt(num2), char, password };
  });

export const part1 = (input: string): number =>
  parsePasswordList(input).filter(({ num1, num2, char, password }) => {
    const occurrences = (password.match(new RegExp(char, 'g')) || []).length;
    return occurrences >= num1 && occurrences <= num2;
  }).length;

export const part2 = (input: string): number =>
  parsePasswordList(input).filter(
    ({ num1, num2, char, password }) => (password[num1 - 1] === char) !== (password[num2 - 1] === char),
  ).length;
