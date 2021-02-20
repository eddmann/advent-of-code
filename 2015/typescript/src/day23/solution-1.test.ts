import { part1 } from './solution-1';

test('`b` register value after program execution', () => {
  const INSTRUCTIONS = `
inc b
jio b, +2
tpl b
inc b
`.trim();

  expect(part1(INSTRUCTIONS)).toBe(2);
});
