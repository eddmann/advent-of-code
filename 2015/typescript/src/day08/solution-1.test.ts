import { part1, part2 } from './solution-1';

const STRING_LITERALS = `
""
"abc"
"aaa\\"aaa"
"\\x27"
`.trim();

test('decode string literals', () => {
  expect(part1(STRING_LITERALS)).toBe(12);
});

test('encode string literals', () => {
  expect(part2(STRING_LITERALS)).toBe(19);
});
