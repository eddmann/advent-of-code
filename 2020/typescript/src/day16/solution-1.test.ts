import { part1, part2 } from './solution-1';

test('calculate ticket scanning error rate', () => {
  const TICKET_NOTES = `
class: 1-3 or 5-7
row: 6-11 or 33-44
seat: 13-40 or 45-50

your ticket:
7,1,14

nearby tickets:
7,3,47
40,4,50
55,2,20
38,6,12
`.trim();

  expect(part1(TICKET_NOTES)).toBe(71);
});

test('product of departure columns', () => {
  const TICKET_NOTES = `
departure class: 0-1 or 4-19
row: 0-5 or 8-19
departure seat: 0-13 or 16-19

your ticket:
11,12,13

nearby tickets:
3,9,18
15,1,5
5,14,9
`.trim();

  expect(part2(TICKET_NOTES)).toBe(156);
});
