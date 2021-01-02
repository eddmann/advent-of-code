import { sum, product, toInt } from '../helpers';

type Expression = string;
type Token = string;
type Operators = {
  [operator: string]: {
    operation: (a: number, b: number) => number;
    precedence: number;
  };
};

const parseHomework = (input: string): Expression[] => input.split('\n');

const peek = <T>(a: T[]): T | undefined => (a.length > 0 ? a[a.length - 1] : undefined);

const shuntingYard = (operators: Operators, expression: Expression): Token[] => {
  const { output, stack } = [...expression].reduce(
    ({ output, stack }, token) => {
      if (token === '(') {
        return { output, stack: [...stack, token] };
      }

      if (token === ')') {
        while (peek(stack) !== '(') {
          output = [...output, stack.pop()];
        }
        stack.pop();
        return { output, stack };
      }

      if (operators[token]) {
        while (operators[peek(stack)] && operators[token].precedence <= operators[peek(stack)].precedence) {
          output = [...output, stack.pop()];
        }
        return { output, stack: [...stack, token] };
      }

      return { output: token === ' ' ? output : [...output, token], stack };
    },
    { output: [] as Token[], stack: [] as Token[] },
  );

  return [...output, ...stack.reverse()];
};

const evaluate = (operators: Operators) => (expression: string): number => {
  const rpn = shuntingYard(operators, expression);

  return rpn.reduce((stack, token) => {
    if (!operators[token]) {
      return [...stack, toInt(token)];
    }

    const [arg2, arg1] = [stack.pop(), stack.pop()];
    return [...stack, operators[token].operation(arg1, arg2)];
  }, [] as number[])[0];
};

export const part1 = (input: string): number => {
  const homework = parseHomework(input);

  const operators = {
    '+': {
      operation: sum,
      precedence: 1,
    },
    '*': {
      operation: product,
      precedence: 1,
    },
  };

  return homework.map(evaluate(operators)).reduce(sum);
};

export const part2 = (input: string): number => {
  const homework = parseHomework(input);

  const operators = {
    '+': {
      operation: sum,
      precedence: 2,
    },
    '*': {
      operation: product,
      precedence: 1,
    },
  };

  return homework.map(evaluate(operators)).reduce(sum);
};
