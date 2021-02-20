const lookAndSay = (input: string): string =>
  input.match(/(\d)\1*/g).reduce((next, digit) => next + digit.length + digit[0], '');

const repeat = <T>(times: number, fn: (x: T) => T, initialValue?: T): T => {
  let accumulator = initialValue;
  while (times--) accumulator = fn(accumulator);
  return accumulator;
};

export const part1 = (input: string): number => repeat(40, lookAndSay, input).length;

export const part2 = (input: string): number => repeat(50, lookAndSay, input).length;
