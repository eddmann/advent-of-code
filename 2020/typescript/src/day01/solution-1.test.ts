import { part1, part2 } from './solution-1';

const EXPENSE_REPORT = `
1721
979
366
299
675
1456
`.trim();

test('find two entries that sum to 2020', () => {
  expect(part1(EXPENSE_REPORT)).toBe(514579);
});

test('find three entries that sum to 2020', () => {
  expect(part2(EXPENSE_REPORT)).toBe(241861950);
});
