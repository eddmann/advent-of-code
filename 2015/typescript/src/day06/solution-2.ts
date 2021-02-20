import { toInt, sum } from '../helpers';

type Light = { row: number; col: number };
type Range = { from: Light; to: Light };
enum Action {
  On,
  Off,
  Toggle,
}
type Instruction = [Action, Range];

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
  const lights = new Uint8Array(1000 * 1000);

  for (const [action, { from, to }] of parseInstructions(input)) {
    for (let row = from.row; row <= to.row; row++) {
      for (let col = from.col; col <= to.col; col++) {
        lights[1000 * row + col] = action === Action.On ? 1 : action === Action.Off ? 0 : 1 - lights[1000 * row + col];
      }
    }
  }

  return lights.reduce(sum);
};

export const part2 = (input: string): number => {
  const lights = new Uint8Array(1000 * 1000);

  for (const [action, { from, to }] of parseInstructions(input)) {
    for (let row = from.row; row <= to.row; row++) {
      for (let col = from.col; col <= to.col; col++) {
        lights[1000 * row + col] = Math.max(
          0,
          lights[1000 * row + col] + (action === Action.On ? 1 : action === Action.Off ? -1 : 2),
        );
      }
    }
  }

  return lights.reduce(sum);
};
