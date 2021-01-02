import { part1, part2 } from './solution-1';

const PLAYER_DECKS = `
Player 1:
9
2
6
3
1

Player 2:
5
8
4
7
10
`.trim();

test('winning player score', () => {
  expect(part1(PLAYER_DECKS)).toBe(306);
});

test('recursive winning player score', () => {
  expect(part2(PLAYER_DECKS)).toBe(291);
});
