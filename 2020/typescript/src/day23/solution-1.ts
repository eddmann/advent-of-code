import { toInt, repeat } from '../helpers';

type Cup = number;

const parseCups = (input: string): Cup[] => input.split('').map(toInt);

const buildCupCircle = (initialCups: Cup[], totalCups = 1_000_000) => {
  const cupCircle = new Map<Cup, Cup>();

  for (let i = 0; i < totalCups; i++) {
    if (i < initialCups.length - 1) {
      cupCircle.set(initialCups[i], initialCups[i + 1]);
      continue;
    }

    if (i === initialCups.length - 1) {
      cupCircle.set(initialCups[i], i + 2);
      continue;
    }

    cupCircle.set(i + 1, i + 2);
  }

  cupCircle.set(totalCups, initialCups[0]);

  return { cupCircle, minCup: Math.min(...initialCups), maxCup: totalCups };
};

export const part1 = (input: string): number => {
  const cups = parseCups(input);
  const minCup = Math.min(...cups);
  const maxCup = Math.max(...cups);

  let currentCupIdx = 0;

  repeat(100, () => {
    const currentCup = cups[currentCupIdx];

    const cupOne = cups[(currentCupIdx + 1) % cups.length];
    const cupTwo = cups[(currentCupIdx + 2) % cups.length];
    const cupThree = cups[(currentCupIdx + 3) % cups.length];

    cups.splice(cups.indexOf(cupOne), 1);
    cups.splice(cups.indexOf(cupTwo), 1);
    cups.splice(cups.indexOf(cupThree), 1);

    let destinationCup = currentCup > minCup ? currentCup - 1 : maxCup;
    while ([cupOne, cupTwo, cupThree].includes(destinationCup)) {
      destinationCup = destinationCup > minCup ? destinationCup - 1 : maxCup;
    }

    cups.splice(cups.indexOf(destinationCup) + 1, 0, cupThree);
    cups.splice(cups.indexOf(destinationCup) + 1, 0, cupTwo);
    cups.splice(cups.indexOf(destinationCup) + 1, 0, cupOne);

    currentCupIdx = (cups.indexOf(currentCup) + 1) % cups.length;
  });

  return toInt([...cups.slice(cups.indexOf(1) + 1), ...cups.slice(0, cups.indexOf(1))].join(''));
};

export const part2 = (input: string): number => {
  const cups = parseCups(input);
  const { cupCircle, minCup, maxCup } = buildCupCircle(cups);

  let currentCup = cups[0];

  repeat(10_000_000, () => {
    const cupOne = cupCircle.get(currentCup);
    const cupTwo = cupCircle.get(cupOne);
    const cupThree = cupCircle.get(cupTwo);

    let destinationCupLabel = currentCup > minCup ? currentCup - 1 : maxCup;
    while ([cupOne, cupTwo, cupThree].includes(destinationCupLabel)) {
      destinationCupLabel = destinationCupLabel > minCup ? destinationCupLabel - 1 : maxCup;
    }

    cupCircle.set(currentCup, cupCircle.get(cupThree));
    cupCircle.set(cupThree, cupCircle.get(destinationCupLabel));
    cupCircle.set(destinationCupLabel, cupOne);

    currentCup = cupCircle.get(currentCup);
  });

  return cupCircle.get(1) * cupCircle.get(cupCircle.get(1));
};
