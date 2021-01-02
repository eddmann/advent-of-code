import { toInt } from '../helpers';

const parseXmasData = (input: string) => {
  const [offset, data] = input.split('\n\n');
  return { offset: +offset, data: data.split('\n').map(toInt) };
};

export const part1 = (input: string): number => {
  const { offset, data } = parseXmasData(input);

  return data.find((target, idx) => {
    if (idx < offset) return false;
    const preamble = data.slice(idx - offset, idx);
    return !preamble.some(number => preamble.includes(target - number));
  });
};

export const part2 = (input: string): number => {
  const { data } = parseXmasData(input);
  const goal = part1(input);

  let start = 0;
  let end = 1;
  let sum = 0;
  let partition: number[] = [];

  while (sum !== goal) {
    partition = data.slice(start, end);
    sum = partition.reduce((acc, val) => acc + val, 0);
    if (sum > goal) start++;
    if (sum < goal) end++;
  }

  return Math.min(...partition) + Math.max(...partition);
};
