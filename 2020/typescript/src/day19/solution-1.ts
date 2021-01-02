import { toInt } from '../helpers';

type Constant = string;
type SubRule = number[][];
type Rule = SubRule | Constant;
type RuleMap = Map<number, Rule>;

export const parseRulesAndMessages = (input: string): { rules: RuleMap; messages: string[] } => {
  const [rules, messages] = input.split('\n\n');

  return {
    rules: rules
      .split('\n')
      .map(rule => rule.split(': '))
      .reduce(
        (map, [idx, rule]) =>
          map.set(
            toInt(idx),
            rule[0] === '"' ? rule[1] : rule.split(' | ').map(subRule => subRule.split(' ').map(toInt)),
          ),
        new Map<number, Rule>(),
      ),
    messages: messages.split('\n'),
  };
};

const isMatch = (ruleMap: RuleMap, message: string, [rule, ...remainingRules]: number[]): boolean => {
  if (rule === undefined || message.length === 0) {
    return rule === undefined && message.length === 0;
  }

  const nextRule = ruleMap.get(rule);

  if (Array.isArray(nextRule)) {
    return nextRule.some(subRule => isMatch(ruleMap, message, [...subRule, ...remainingRules]));
  }

  return nextRule === message[0] && isMatch(ruleMap, message.substr(1), remainingRules);
};

export const part1 = (input: string): number => {
  const { rules, messages } = parseRulesAndMessages(input);

  return messages.filter(message => isMatch(rules, message, [0])).length;
};

export const part2 = (input: string): number => {
  const { rules, messages } = parseRulesAndMessages(input);

  rules.set(8, [[42], [42, 8]]);
  rules.set(11, [
    [42, 31],
    [42, 11, 31],
  ]);

  return messages.filter(message => isMatch(rules, message, [0])).length;
};
