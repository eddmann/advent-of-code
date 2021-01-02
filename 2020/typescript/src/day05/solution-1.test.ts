import { part1 } from './solution-1';

const BOARDING_PASSES = `
FBFBBFFRLR
BFFFBBFRRR
FFFBBBFRRR
BBFFBBFRLL
`.trim();

test('highest boarding pass seat id', () => {
  expect(part1(BOARDING_PASSES)).toBe(820);
});
