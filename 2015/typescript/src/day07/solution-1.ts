import { memoize, toInt } from '../helpers';

type Wire = string;
type Instruction = string;
type Circuit = Map<Wire, Instruction>;

const parseCircuit = (input: string): Circuit =>
  input.split('\n').reduce((circuit, line) => {
    const [instruction, wire] = line.split(' -> ');
    return circuit.set(wire, instruction);
  }, new Map());

const getEmulatedSignal = (circuit: Circuit, wire: Wire): number => {
  const emulate = memoize((wire: Wire): number => {
    if (/^(\d)+$/.test(wire)) {
      return toInt(wire);
    }

    const instruction = circuit.get(wire).split(' ');

    switch (true) {
      case instruction.includes('AND'):
        return emulate(instruction[0]) & emulate(instruction[2]);
      case instruction.includes('OR'):
        return emulate(instruction[0]) | emulate(instruction[2]);
      case instruction.includes('LSHIFT'):
        return emulate(instruction[0]) << emulate(instruction[2]);
      case instruction.includes('RSHIFT'):
        return emulate(instruction[0]) >> emulate(instruction[2]);
      case instruction.includes('NOT'):
        return ~emulate(instruction[1]) & 0xffff;
      default:
        return emulate(instruction[0]);
    }
  });

  return emulate(wire);
};

export const part1 = (input: string): number => getEmulatedSignal(parseCircuit(input), 'a');

export const part2 = (input: string): number => {
  const circuit = parseCircuit(input);
  circuit.set('b', getEmulatedSignal(circuit, 'a').toString());
  return getEmulatedSignal(circuit, 'a');
};
