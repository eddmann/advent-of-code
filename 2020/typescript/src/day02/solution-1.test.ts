import { parsePasswordList, part1, part2 } from './solution-1';

const PASSWORD_LIST = `
1-3 a: abcde
1-3 b: cdefg
2-9 c: ccccccccc
`.trim();

test('parses password list', () => {
  expect(parsePasswordList(PASSWORD_LIST)).toEqual([
    { num1: 1, num2: 3, char: 'a', password: 'abcde' },
    { num1: 1, num2: 3, char: 'b', password: 'cdefg' },
    { num1: 2, num2: 9, char: 'c', password: 'ccccccccc' },
  ]);
});

test('count valid passwords based on character occurrence', () => {
  expect(part1(PASSWORD_LIST)).toBe(2);
});

test('count valid passwords based on character position', () => {
  expect(part2(PASSWORD_LIST)).toBe(1);
});
