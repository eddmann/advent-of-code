import { toInt } from '../helpers';

type BattleState = {
  playerHp: number;
  playerMana: number;
  playerArmor: number;
  bossHp: number;
  bossDamage: number;
  manaSpent: number;
  activeEffects: Spell[];
};

type Spell = {
  name: string;
  cost: number;
  damage: number;
  armor: number;
  heal: number;
  mana: number;
  turns: number;
};

type BattleConfiguration = Pick<BattleState, 'playerHp' | 'playerMana' | 'bossHp' | 'bossDamage'>;
type BattleTransition = (state: BattleState) => BattleState;
type BattleRound = (spell: Spell) => BattleTransition;

const spells: Spell[] = [
  { name: 'Magic Missile', cost: 53, damage: 4, armor: 0, heal: 0, mana: 0, turns: 1 },
  { name: 'Drain', cost: 73, damage: 2, armor: 0, heal: 2, mana: 0, turns: 1 },
  { name: 'Shield', cost: 113, damage: 0, armor: 7, heal: 0, mana: 0, turns: 6 },
  { name: 'Poison', cost: 173, damage: 3, armor: 0, heal: 0, mana: 0, turns: 6 },
  { name: 'Recharge', cost: 229, damage: 0, armor: 0, heal: 0, mana: 101, turns: 5 },
];

const sumProp = <T>(els: T[], prop: keyof T) => els.reduce((sum, el) => sum + +el[prop], 0);

const pipe = <R>(fn1: (a: R) => R, ...fns: Array<(a: R) => R>) =>
  fns.reduce((prevFn, nextFn) => value => nextFn(prevFn(value)), fn1);

const hasBattleEnded = (state: BattleState) => state.bossHp <= 0 || state.playerHp <= 0;

const isPlayerWinner = (state: BattleState) => hasBattleEnded(state) && state.playerHp > 0;

const getAvailableSpells = (state: BattleState): Spell[] => {
  if (hasBattleEnded(state)) return [];

  return spells.filter(spell => {
    const active = state.activeEffects.find(effect => spell.name === effect.name);
    return spell.cost <= state.playerMana && (!active || active.turns === 1);
  });
};

const enactEffects: BattleTransition = state => {
  if (hasBattleEnded(state)) return state;

  return {
    ...state,
    playerMana: state.playerMana + sumProp(state.activeEffects, 'mana'),
    playerArmor: sumProp(state.activeEffects, 'armor'),
    bossHp: state.bossHp - sumProp(state.activeEffects, 'damage'),
    activeEffects: state.activeEffects.reduce(
      (effects, effect) => (effect.turns > 1 ? [...effects, { ...effect, turns: effect.turns - 1 }] : effects),
      [],
    ),
  };
};

const playerTurn = (spell: Spell): BattleTransition => state => {
  if (hasBattleEnded(state)) return state;

  const isSpellEffect = spell.turns > 1;

  return {
    ...state,
    playerHp: state.playerHp + (isSpellEffect ? 0 : spell.heal),
    playerMana: state.playerMana - spell.cost,
    bossHp: state.bossHp - (isSpellEffect ? 0 : spell.damage),
    manaSpent: state.manaSpent + spell.cost,
    activeEffects: isSpellEffect ? [...state.activeEffects, spell] : state.activeEffects,
  };
};

const bossTurn: BattleTransition = state => {
  if (hasBattleEnded(state)) return state;

  return {
    ...state,
    playerHp: state.playerHp - Math.max(state.bossDamage - state.playerArmor, 1),
  };
};

const minManaSpent = (configuration: BattleConfiguration, round: BattleRound): number => {
  let minMana = Infinity;

  const recur = (state: BattleState): void => {
    if (state.manaSpent > minMana) return;

    if (getAvailableSpells(state).length === 0) {
      if (isPlayerWinner(state)) minMana = state.manaSpent;
      return;
    }

    for (const spell of getAvailableSpells(state)) {
      recur(round(spell)(state));
    }
  };

  recur({
    ...configuration,
    playerArmor: 0,
    manaSpent: 0,
    activeEffects: [],
  });

  return minMana;
};

const roundOfBattle: BattleRound = spell => pipe(enactEffects, playerTurn(spell), enactEffects, bossTurn);

export const part1 = (input: string): number => {
  const [bossHp, bossDamage] = input.match(/(\d+)/gm).map(toInt);

  return minManaSpent({ playerHp: 50, playerMana: 500, bossHp, bossDamage }, roundOfBattle);
};

const applyHardMode: BattleTransition = state => ({
  ...state,
  playerHp: state.playerHp - 1,
});

const hardRoundOfBattle: BattleRound = spell => pipe(applyHardMode, roundOfBattle(spell));

export const part2 = (input: string): number => {
  const [bossHp, bossDamage] = input.match(/(\d+)/gm).map(toInt);

  return minManaSpent({ playerHp: 50, playerMana: 500, bossHp, bossDamage }, hardRoundOfBattle);
};
