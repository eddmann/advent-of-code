import { toInt } from '../helpers';

const registers = ['a', 'b'] as const;
type Register = typeof registers[number];
type Registers = { [R in Register]: number };

type Instruction =
  | { op: 'hlf' | 'tpl' | 'inc'; register: Register }
  | { op: 'jie' | 'jio'; register: Register; offset: number }
  | { op: 'jmp'; offset: number };

const isRegister = (input: string): input is Register => registers.includes(input as Register);

const parseInstructions = (input: string): Instruction[] =>
  input.split('\n').map(line => {
    const [op, ...args] = line.replace(',', '').split(' ');

    switch (op) {
      case 'hlf':
      case 'tpl':
      case 'inc':
        if (!isRegister(args[0])) throw new Error(`Unknown register ${args[0]}`);
        return { op, register: args[0] };
      case 'jie':
      case 'jio':
        if (!isRegister(args[0])) throw new Error(`Unknown register ${args[0]}`);
        return { op, register: args[0], offset: toInt(args[1]) };
      case 'jmp':
        return { op, offset: toInt(args[0]) };
      default:
        throw new Error(`Unknown instruction ${op}`);
    }
  });

const execute = (instructions: Instruction[], registers: Registers): Registers => {
  let pointer = 0;

  while (pointer < instructions.length) {
    const instruction = instructions[pointer];

    switch (instruction.op) {
      case 'hlf':
        registers[instruction.register] /= 2;
        pointer += 1;
        break;
      case 'tpl':
        registers[instruction.register] *= 3;
        pointer += 1;
        break;
      case 'inc':
        registers[instruction.register] += 1;
        pointer += 1;
        break;
      case 'jie':
        pointer += registers[instruction.register] % 2 === 0 ? instruction.offset : 1;
        break;
      case 'jio':
        pointer += registers[instruction.register] === 1 ? instruction.offset : 1;
        break;
      case 'jmp':
        pointer += instruction.offset;
        break;
      default:
        const unhandled: never = instruction;
        throw new Error(`Unhandled instruction`);
    }
  }

  return registers;
};

export const part1 = (input: string): number => execute(parseInstructions(input), { a: 0, b: 0 }).b;

export const part2 = (input: string): number => execute(parseInstructions(input), { a: 1, b: 0 }).b;
