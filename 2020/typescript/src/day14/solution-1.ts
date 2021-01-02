import { sum, toInt } from '../helpers';

type Instruction = { op: 'mask'; value: string } | { op: 'mem'; address: number; value: number };
type Memory = Map<number, number>;
type ProgramState = { mask: string; memory: Memory };
type MemoryUpdater = (state: ProgramState, address: number, value: number) => Memory;

const parseProgram = (input: string): Instruction[] =>
  input.split('\n').map((instruction: string) => {
    const [op, value] = instruction.split(' = ');

    if (op === 'mask') {
      return { op, value };
    }

    const [, address] = op.match(/mem\[(\d+)]/);
    return { op: 'mem', address: toInt(address), value: toInt(value) };
  });

const exec = (memoryUpdater: MemoryUpdater, program: Instruction[]): ProgramState =>
  program.reduce(
    (state: ProgramState, instruction): ProgramState => {
      switch (instruction.op) {
        case 'mask':
          return { ...state, mask: instruction.value };
        case 'mem':
          return { ...state, memory: memoryUpdater(state, instruction.address, instruction.value) };
        default:
          return state;
      }
    },
    { mask: '000000000000000000000000000000000000', memory: new Map() },
  );

const toBinary = (decimal: number, length = 36) => decimal.toString(2).padStart(length, '0');

const applyMask = (decimal: number, mask: string): number => {
  const binary = toBinary(decimal);

  return parseInt(
    mask.replace(/X/g, (_, idx) => binary[idx]),
    2,
  );
};

const decodeMemoryAddresses = (address: number, mask: string): number[] => {
  const binary = toBinary(address);
  const newAddress = mask.replace(/0/g, (_, idx) => binary[idx]);
  const totalFloatingBits = [...newAddress].filter(b => b === 'X').length;

  return Array.from({ length: 2 ** totalFloatingBits }).map((_, idx) => {
    const binaryIdx = toBinary(idx, totalFloatingBits).split('');
    return parseInt(
      newAddress.replace(/X/g, () => binaryIdx.pop()),
      2,
    );
  });
};

export const part1 = (input: string): number => {
  const program = parseProgram(input);

  const { memory } = exec(({ mask, memory }, address, value) => memory.set(address, applyMask(value, mask)), program);

  return [...memory.values()].reduce(sum);
};

export const part2 = (input: string): number => {
  const program = parseProgram(input);

  const memoryAddressDecoder: MemoryUpdater = ({ mask, memory }, address, value) =>
    decodeMemoryAddresses(address, mask).reduce((memory, decoded) => memory.set(decoded, value), memory);

  const { memory } = exec(memoryAddressDecoder, program);

  return [...memory.values()].reduce(sum);
};
