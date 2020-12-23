const buildCupCircle = (initialCups, totalCups = 1_000_000) => {
  const head = { v: initialCups[0], n: null };
  const lookup = { [initialCups[0]]: head };
  let tail = head;

  for (let i = 1; i < totalCups; i++) {
    if (i < initialCups.length) {
      lookup[initialCups[i]] = tail.n = tail = {
        v: initialCups[i],
        n: null,
      };

      continue;
    }

    lookup[i + 1] = tail.n = tail = { v: i + 1, n: null };
  }

  tail.n = head;

  return [Math.min(...initialCups), totalCups, head, lookup];
};

const print = (start) => {
  let xs = [start.v];

  let next = start;
  while ((next = next.n) && next.v !== start.v) {
    xs.push(next.v);
  }

  return xs;
};

const part2 = (cups) => {
  const [minCupLabel, maxCupLabel, cupCircleHead, cupLookup] = buildCupCircle(
    cups
  );

  let currentCup = cupCircleHead;
  for (let i = 0; i < 10_000_000; i++) {
    const cupOne = currentCup.n;
    const cupTwo = cupOne.n;
    const cupThree = cupTwo.n;

    let destinationCupLabel =
      currentCup.v > minCupLabel ? currentCup.v - 1 : maxCupLabel;

    while ([cupOne.v, cupTwo.v, cupThree.v].includes(destinationCupLabel)) {
      destinationCupLabel =
        destinationCupLabel > minCupLabel
          ? destinationCupLabel - 1
          : maxCupLabel;
    }

    const destinationCup = cupLookup[destinationCupLabel];

    currentCup.n = cupThree.n;
    cupThree.n = destinationCup.n;
    destinationCup.n = cupOne;

    currentCup = currentCup.n;
  }

  return cupLookup[1].n.v * cupLookup[1].n.n.v;
};

const cups = require("fs")
  .readFileSync(process.argv[2], "utf-8")
  .split("")
  .map(Number);

console.log(part2(cups));
