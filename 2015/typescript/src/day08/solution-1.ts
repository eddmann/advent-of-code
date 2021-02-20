export const part1 = (input: string): number =>
  input.split('\n').reduce((total, line) => total + (line.length - eval(line).length), 0);

export const part2 = (input: string): number =>
  input.split('\n').reduce((total, line) => total + (JSON.stringify(line).length - line.length), 0);
