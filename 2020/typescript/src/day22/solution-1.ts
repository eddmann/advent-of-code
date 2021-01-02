import { toInt } from '../helpers';

enum Player {
  One = 1,
  Two = 2,
}
type Deck = number[];

const parsePlayerDecks = (input: string): [Deck, Deck] =>
  input.split('\n\n').map(deck => deck.split('\n').map(toInt).filter(Boolean)) as [Deck, Deck];

const combat = (player1: Deck, player2: Deck): Deck => {
  [player1, player2] = [[...player1], [...player2]];

  while (player1.length > 0 && player2.length > 0) {
    const [card1, card2] = [player1.shift(), player2.shift()];

    if (card1 > card2) {
      player1.push(card1, card2);
    } else {
      player2.push(card2, card1);
    }
  }

  return player1.length > 0 ? player1 : player2;
};

const recursiveCombat = (player1: Deck, player2: Deck): Deck => {
  const history = new Set<string>();

  const doCombat = (p1: Deck, p2: Deck, game: number): [Player, Deck] => {
    while (p1.length > 0 && p2.length > 0) {
      const hash = `${p1.join('')}-${p2.join('')}-${game}`;

      if (history.has(hash)) {
        return [Player.One, p1];
      }

      history.add(hash);

      const [card1, card2] = [p1.shift(), p2.shift()];

      let winner;
      if (p1.length >= card1 && p2.length >= card2) {
        [winner] = doCombat(p1.slice(0, card1), p2.slice(0, card2), game + 1);
      } else {
        winner = card1 > card2 ? Player.One : Player.Two;
      }

      if (winner === Player.One) {
        p1.push(card1, card2);
      } else {
        p2.push(card2, card1);
      }
    }

    return [p1.length > 0 ? Player.One : Player.Two, p1.length > 0 ? p1 : p2];
  };

  const [, winningDeck] = doCombat([...player1], [...player2], 1);

  return winningDeck;
};

const calculateScore = (deck: Deck) => deck.reverse().reduce((acc, val, idx) => acc + val * (idx + 1), 0);

export const part1 = (input: string): number => {
  const [player1, player2] = parsePlayerDecks(input);

  return calculateScore(combat(player1, player2));
};

export const part2 = (input: string): number => {
  const [player1, player2] = parsePlayerDecks(input);

  return calculateScore(recursiveCombat(player1, player2));
};
