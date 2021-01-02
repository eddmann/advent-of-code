import { part1, part2 } from './solution-1';

const SEAT_LAYOUT = `
L.LL.LL.LL
LLLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLLL
L.LLLLLL.L
L.LLLLL.LL
`.trim();

test('occupied seats', () => {
  expect(part1(SEAT_LAYOUT)).toBe(37);
});

test('occupied seats within sight', () => {
  expect(part2(SEAT_LAYOUT)).toBe(26);
});
