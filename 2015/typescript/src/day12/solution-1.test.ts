import { part1, part2 } from './solution-1';

test('sum all json document numbers', () => {
  expect(part1('[1,2,3]')).toBe(6);
  expect(part1('{"a":2,"b":4}')).toBe(6);
  expect(part1('[[[3]]]')).toBe(3);
  expect(part1('{"a":{"b":4},"c":-1}')).toBe(3);
  expect(part1('{"a":[-1,1]}')).toBe(0);
  expect(part1('[]')).toBe(0);
  expect(part1('{}')).toBe(0);
});

test('sum all json document numbers (excluding red object occurrences)', () => {
  expect(part2('[1,2,3]')).toBe(6);
  expect(part2('[1,{"c":"red","b":2},3]')).toBe(4);
  expect(part2('{"d":"red","e":[1,2,3,4],"f":5}')).toBe(0);
  expect(part2('[1,"red",5]')).toBe(6);
});
