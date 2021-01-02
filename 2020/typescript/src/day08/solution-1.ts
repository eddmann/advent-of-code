type Operation = 'acc' | 'jmp' | 'nop';
type Intruction = { op: Operation; val: number };
type Program = Intruction[];
type Execution = { accumulator: number; terminated: boolean };

const isOperation = (op: string): op is Operation => ['acc', 'jmp', 'nop'].includes(op);
const parseProgram = (input: string): Program =>
  input
    .split('\n')
    .map(instruction => instruction.split(' '))
    .map(([op, val]) => {
      if (isOperation(op)) return { op, val: +val };
      throw new Error(`Invalid operation ${op}`);
    });

const exec = (program: Program): Execution => {
  const executed = new Set();
  let pointer = 0;
  let accumulator = 0;

  while (pointer < program.length) {
    if (executed.has(pointer)) {
      return { accumulator, terminated: false };
    }

    const { op, val } = program[pointer];
    executed.add(pointer);

    switch (op) {
      case 'jmp':
        pointer += val;
        break;
      case 'acc':
        accumulator += val;
      case 'nop':
        pointer++;
    }
  }

  return { accumulator, terminated: true };
};

function* generateModifiedProgram(program: Program): Generator<Program> {
  for (let pointer = 0; pointer < program.length; pointer++) {
    const { op, val } = program[pointer];
    if (op === 'acc') continue;

    const modified = [...program];
    modified[pointer] = { op: op === 'jmp' ? 'nop' : 'jmp', val };

    yield modified;
  }
}

export const part1 = (input: string): number => exec(parseProgram(input)).accumulator;

export const part2 = (input: string): number | undefined => {
  for (const program of generateModifiedProgram(parseProgram(input))) {
    const { accumulator, terminated } = exec(program);

    if (terminated) {
      return accumulator;
    }
  }

  return undefined;
};
