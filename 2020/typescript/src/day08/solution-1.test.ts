import { part1, part2 } from './solution-1';

const PROGRAM = `
nop +0
acc +1
jmp +4
acc +3
jmp -3
acc -99
acc +1
jmp -4
acc +6
`.trim();

test('halt on repeated instruction', () => {
  expect(part1(PROGRAM)).toBe(5);
});

test('modify program for successful termination', () => {
  expect(part2(PROGRAM)).toBe(8);
});
