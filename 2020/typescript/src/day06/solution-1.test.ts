import { part1, part2 } from './solution-1';

const GROUP_ANSWERS = `
abc

a
b
c

ab
ac

a
a
a
a

b
`.trim();

test('count any answered group questions', () => {
  expect(part1(GROUP_ANSWERS)).toBe(11);
});

test('count all answered group questions', () => {
  expect(part2(GROUP_ANSWERS)).toBe(6);
});
