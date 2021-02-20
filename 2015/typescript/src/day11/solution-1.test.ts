import { part1 } from './solution-1';

test('generate next password', () => {
  expect(part1('abcdefgh')).toBe('abcdffaa');
  expect(part1('ghijklmn')).toBe('ghjaabcc');
});
