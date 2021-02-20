import { part1, part2 } from './solution-1';

test('distinct molecules which can be created', () => {
  const REPLACEMENTS_AND_MOLECULE = `
H => HO
H => OH
O => HH

HOH
`.trim();

  expect(part1(REPLACEMENTS_AND_MOLECULE)).toBe(4);
});

test('fewest number of steps to get to `e`', () => {
  const REPLACEMENTS_AND_MOLECULE = `
e => H
e => O
H => HO
H => OH
O => HH

HOH
`.trim();

  expect(part2(REPLACEMENTS_AND_MOLECULE)).toBe(3);
});
