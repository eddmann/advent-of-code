import { parseBagRules, part1, part2 } from './solution-1';

test('parse bag rules', () => {
  const BAG_RULES = `
dark orange bags contain 3 bright white bags, 4 muted yellow bags.
bright white bags contain 1 shiny gold bag.
faded blue bags contain no other bags.
`.trim();

  expect(parseBagRules(BAG_RULES)).toEqual(
    new Map([
      [
        'dark orange',
        [
          { colour: 'bright white', count: 3 },
          { colour: 'muted yellow', count: 4 },
        ],
      ],
      ['bright white', [{ colour: 'shiny gold', count: 1 }]],
      ['faded blue', []],
    ]),
  );
});

test('total bags which can contain shiny gold bag', () => {
  const BAG_RULES = `
light red bags contain 1 bright white bag, 2 muted yellow bags.
dark orange bags contain 3 bright white bags, 4 muted yellow bags.
bright white bags contain 1 shiny gold bag.
muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
dark olive bags contain 3 faded blue bags, 4 dotted black bags.
vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
faded blue bags contain no other bags.
dotted black bags contain no other bags.
`.trim();

  expect(part1(BAG_RULES)).toBe(4);
});

test('total bags a shiny gold bag contains', () => {
  const BAG_RULES = `
shiny gold bags contain 2 dark red bags.
dark red bags contain 2 dark orange bags.
dark orange bags contain 2 dark yellow bags.
dark yellow bags contain 2 dark green bags.
dark green bags contain 2 dark blue bags.
dark blue bags contain 2 dark violet bags.
dark violet bags contain no other bags.
`.trim();

  expect(part2(BAG_RULES)).toBe(126);
});
