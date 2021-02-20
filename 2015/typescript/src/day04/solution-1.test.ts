import { part1 } from './solution-1';

test('five leading zeros', () => {
  expect(part1('abcdef')).toBe(609043);
  expect(part1('pqrstuv')).toBe(1048970);
});
