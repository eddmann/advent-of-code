const combat = (player1, player2) => {
  [player1, player2] = [[...player1], [...player2]];

  while (player1.length > 0 && player2.length > 0) {
    const [v1, v2] = [player1.shift(), player2.shift()];

    if (v1 > v2) {
      player1.push(v1, v2);
    } else {
      player2.push(v2, v1);
    }
  }

  return player1.length > 0 ? player1 : player2;
};

const recursiveCombat = (player1, player2) => {
  const history = new Set();

  const doCombat = (p1, p2, game) => {
    while (p1.length > 0 && p2.length > 0) {
      const hash = `${p1.join("")}-${p2.join("")}-${game}`;

      if (history.has(hash)) {
        return [1, p1];
      }

      history.add(hash);

      const [v1, v2] = [p1.shift(), p2.shift()];

      let winner;
      if (p1.length >= v1 && p2.length >= v2) {
        [winner] = doCombat(p1.slice(0, v1), p2.slice(0, v2), game + 1);
      } else {
        winner = v1 > v2 ? 1 : 2;
      }

      if (winner === 1) {
        p1.push(v1, v2);
      } else {
        p2.push(v2, v1);
      }
    }

    return [p1.length > 0 ? 1 : 2, p1.length > 0 ? p1 : p2];
  };

  const [, winningDeck] = doCombat([...player1], [...player2], 1);

  return winningDeck;
};

const calculateScore = (deck) =>
  deck.reverse().reduce((acc, val, idx) => acc + val * (idx + 1), 0);

const part1 = (player1, player2) => {
  const winningDeck = combat(player1, player2);

  return calculateScore(winningDeck);
};

const part2 = (player1, player2) => {
  const winningDeck = recursiveCombat(player1, player2);

  return calculateScore(winningDeck);
};

const [player1, player2] = require("fs")
  .readFileSync(process.argv[2], "utf-8")
  .split("\n\n")
  .map((player) => player.split("\n").map(Number).filter(Boolean));

console.log(part1(player1, player2));
console.log(part2(player1, player2));
