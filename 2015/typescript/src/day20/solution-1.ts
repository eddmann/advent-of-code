import { toInt, sum } from '../helpers';

const elvesWhoVisited = (houseNo: number): number[] => {
  const elves = houseNo > 1 ? [1, houseNo] : [1];

  for (let elf = 2; elf <= Math.sqrt(houseNo); elf++) {
    if (houseNo % elf === 0) {
      elves.push(elf);
      if (elf ** 2 !== houseNo) elves.push(houseNo / elf);
    }
  }

  return elves;
};

export const part1 = (input: string): number => {
  const numOfPresents = toInt(input);
  const presentsPerHouse = 10;

  let houseNo = 1;
  while (true) {
    const elves = elvesWhoVisited(houseNo);
    if (elves.reduce(sum) * presentsPerHouse >= numOfPresents) break;
    houseNo += 1;
  }

  return houseNo;
};

export const part2 = (input: string): number => {
  const numOfPresents = toInt(input);
  const presentsPerHouse = 11;
  const maxDeliveriesPerElf = 50;

  let houseNo = 1;
  while (true) {
    const elves = elvesWhoVisited(houseNo).filter(elf => houseNo / elf <= maxDeliveriesPerElf);
    if (elves.reduce(sum) * presentsPerHouse >= numOfPresents) break;
    houseNo += 1;
  }

  return houseNo;
};
