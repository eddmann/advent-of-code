import { part1, part2 } from './solution-1';

test('apply mask to values', () => {
  const PROGRAM = `
mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X
mem[8] = 11
mem[7] = 101
mem[8] = 0
`.trim();

  expect(part1(PROGRAM)).toBe(165);
});

test('decode memory addresses', () => {
  const PROGRAM = `
mask = 000000000000000000000000000000X1001X
mem[42] = 100
mask = 00000000000000000000000000000000X0XX
mem[26] = 1
`.trim();

  expect(part2(PROGRAM)).toBe(208);
});
