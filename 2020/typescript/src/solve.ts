import { readFileSync } from 'fs';

const exec = (fn: Function, input: string) => {
  const start = process.hrtime();
  const result = fn(input);
  const end = process.hrtime(start);

  return { result, duration: (end[0] * 1000000000 + end[1]) / 1000000 };
};

const [, , dayNo, solutionNo = 1] = process.argv;

console.log(`Day ${dayNo}, Solution ${solutionNo}`);

const daySrcDir = `${__dirname}/day${dayNo.toString().padStart(2, '0')}`;
const { part1, part2 } = require(`${daySrcDir}/solution-${solutionNo}`);
const input = readFileSync(`${daySrcDir}/input.txt`, 'utf-8').trim();

const p1 = exec(part1, input);
console.log(`Part 1: ${p1.result} [time taken: ${p1.duration} ms]`);

const p2 = exec(part2, input);
console.log(`Part 2: ${p2.result} [time taken: ${p2.duration} ms]`);
