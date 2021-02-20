import { toInt, sum } from '../helpers';

type Light = { row: number; col: number };
type Range = { from: Light; to: Light };
enum Action {
  On,
  Off,
  Toggle,
}
type Instruction = [Action, Range];

const create2DArray = <T>(rows: number, cols: number, defaultValue: T): T[][] =>
  Array.from(Array(rows), () => Array(cols).fill(defaultValue));

const parseInstructions = (input: string): Instruction[] =>
  input.split('\n').map(line => {
    const [, action, fr, fc, tr, tc] = line.match(/(.+) (\d+),(\d+) through (\d+),(\d+)/);
    return [
      action === 'turn on' ? Action.On : action === 'turn off' ? Action.Off : Action.Toggle,
      {
        from: { row: toInt(fr), col: toInt(fc) },
        to: { row: toInt(tr), col: toInt(tc) },
      },
    ];
  });

export const part1 = (input: string): number => {
  const lights = create2DArray(1000, 1000, false);

  for (const [action, { from, to }] of parseInstructions(input)) {
    for (let row = from.row; row <= to.row; row++) {
      for (let col = from.col; col <= to.col; col++) {
        lights[row][col] = action === Action.On ? true : action === Action.Off ? false : !lights[row][col];
      }
    }
  }

  return lights.flat().filter(Boolean).length;
};

export const part2 = (input: string): number => {
  const lights = create2DArray(1000, 1000, 0);

  for (const [action, { from, to }] of parseInstructions(input)) {
    for (let row = from.row; row <= to.row; row++) {
      for (let col = from.col; col <= to.col; col++) {
        lights[row][col] = Math.max(0, lights[row][col] + (action === Action.On ? 1 : action === Action.Off ? -1 : 2));
      }
    }
  }

  return lights.flat().reduce(sum);
};
