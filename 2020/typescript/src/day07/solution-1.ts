type BagColour = string;
type BagContains = Array<{ count: number; colour: string }>;
type BagRule = [colour: BagColour, contains: BagContains];

export const parseBagRules = (input: string): Map<BagColour, BagContains> =>
  new Map(input.split('\n').map(parseBagRule));

const parseBagRule = (input: string): BagRule => {
  const [colour, contains] = input.split(' bags contain ');
  return [
    colour,
    [...contains.matchAll(/(\d+) ([a-z\s]+) bag/g)].map(([, count, colour]) => ({
      count: +count,
      colour,
    })),
  ];
};

export const part1 = (input: string): number => {
  const rules = parseBagRules(input);

  const canContainGoldBag = (bagColour: BagColour): boolean => {
    for (const { colour } of rules.get(bagColour).values()) {
      if (colour === 'shiny gold' || canContainGoldBag(colour)) {
        return true;
      }
    }

    return false;
  };

  return [...rules.keys()].filter(canContainGoldBag).length;
};

export const part2 = (input: string): number => {
  const rules = parseBagRules(input);

  const countRequiredBags = (bagColour: BagColour): number =>
    [...rules.get(bagColour)].reduce(
      (total, { colour, count }) => {
        return total + count * countRequiredBags(colour);
      },
      bagColour === 'shiny gold' ? 0 : 1,
    );

  return countRequiredBags('shiny gold');
};
