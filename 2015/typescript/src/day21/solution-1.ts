import { toInt } from '../helpers';

type Item = {
  name: string;
  cost: number;
  damage: number;
  armor: number;
};
type ShopItems = { weapons: Item[]; armor: Item[]; rings: Item[] };

type Participant = { hp: number; damage: number; armor: number };
type PlayerConfiguration = Participant & { cost: number };

const ITEMS = `
Weapons:    Cost  Damage  Armor
Dagger        8     4       0
Shortsword   10     5       0
Warhammer    25     6       0
Longsword    40     7       0
Greataxe     74     8       0

Armor:      Cost  Damage  Armor
Leather      13     0       1
Chainmail    31     0       2
Splintmail   53     0       3
Bandedmail   75     0       4
Platemail   102     0       5

Rings:      Cost  Damage  Armor
Damage +1    25     1       0
Damage +2    50     2       0
Damage +3   100     3       0
Defense +1   20     0       1
Defense +2   40     0       2
Defense +3   80     0       3
`.trim();

const parseItemSection = (section: string): Item[] =>
  [...section.matchAll(/(\w+(?:\s\+\d)?)\s+(\d+)\s+(\d+)\s+(\d+)/g)].map(([, name, cost, damage, armor]) => ({
    name,
    cost: toInt(cost),
    damage: toInt(damage),
    armor: toInt(armor),
  }));

const parseShopItems = (items: string): ShopItems => {
  const [weapons, armor, rings] = items.split('\n\n');
  return {
    weapons: parseItemSection(weapons),
    armor: parseItemSection(armor),
    rings: parseItemSection(rings),
  };
};

const cartesianProduct = <T>(...a: T[][]): T[][] => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())), [[]]);

const sumProp = <T>(els: T[], prop: keyof T) => els.reduce((sum, el) => sum + +el[prop], 0);

const NO_ITEM: Item = { name: 'None', cost: 0, damage: 0, armor: 0 };

const generatePlayerConfigurations = ({ weapons, armor, rings }: ShopItems): PlayerConfiguration[] => {
  const optionalArmor = [...armor, NO_ITEM];
  const optionalRing = [...rings, NO_ITEM];

  return cartesianProduct(weapons, optionalArmor, optionalRing, optionalRing)
    .filter(([, , r1, r2]) => {
      if (r1 === NO_ITEM && r2 !== NO_ITEM) return false;
      return r1.name !== r2.name;
    })
    .map(items => ({
      hp: 100,
      cost: sumProp(items, 'cost'),
      damage: sumProp(items, 'damage'),
      armor: sumProp(items, 'armor'),
    }));
};

const isPlayerWinner = (player: Participant, boss: Participant): boolean => {
  const playerTurnsForWin = Math.ceil(boss.hp / Math.max(player.damage - boss.armor, 1));
  const bossTurnsForWin = Math.ceil(player.hp / Math.max(boss.damage - player.armor, 1));
  return playerTurnsForWin <= bossTurnsForWin;
};

const parseBossConfiguration = (input: string): Participant => {
  const [hp, damage, armor] = input.match(/(\d+)/gm);
  return { hp: toInt(hp), damage: toInt(damage), armor: toInt(armor) };
};

export const part1 = (input: string): number => {
  const items = parseShopItems(ITEMS);
  const boss = parseBossConfiguration(input);

  return Math.min(
    ...generatePlayerConfigurations(items)
      .filter(player => isPlayerWinner(player, boss))
      .map(({ cost }) => cost),
  );
};

export const part2 = (input: string): number => {
  const items = parseShopItems(ITEMS);
  const boss = parseBossConfiguration(input);

  return Math.max(
    ...generatePlayerConfigurations(items)
      .filter(player => !isPlayerWinner(player, boss))
      .map(({ cost }) => cost),
  );
};
