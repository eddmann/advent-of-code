const part1 = (cups) => {
  let availableCups = [...cups];
  let currentCup = 0;

  for (let i = 0; i < 100; i++) {
    const currentCupLabel = availableCups[currentCup];

    // The crab picks up the three cups that are immediately clockwise of the current cup.
    const cupOne = availableCups[(currentCup + 1) % availableCups.length];
    const cupTwo = availableCups[(currentCup + 2) % availableCups.length];
    const cupThree = availableCups[(currentCup + 3) % availableCups.length];

    // They are removed from the circle; cup spacing is adjusted as necessary to maintain the circle.
    availableCups.splice(availableCups.indexOf(cupOne), 1);
    availableCups.splice(availableCups.indexOf(cupTwo), 1);
    availableCups.splice(availableCups.indexOf(cupThree), 1);

    // The crab selects a destination cup: the cup with a label equal to the current cup's label minus one.
    let destinationCupLabel =
      currentCupLabel > Math.min(...cups)
        ? currentCupLabel - 1
        : Math.max(...cups);

    // If this would select one of the cups that was just picked up, the crab will keep subtracting one until it finds a cup that wasn't just picked up.
    // If at any point in this process the value goes below the lowest value on any cup's label, it wraps around to the highest value on any cup's label instead.
    while ([cupOne, cupTwo, cupThree].includes(destinationCupLabel)) {
      destinationCupLabel =
        destinationCupLabel > Math.min(...cups)
          ? destinationCupLabel - 1
          : Math.max(...cups);
    }

    // The crab places the cups it just picked up so that they are immediately clockwise of the destination cup.
    // They keep the same order as when they were picked up.
    availableCups.splice(
      availableCups.indexOf(destinationCupLabel) + 1,
      0,
      cupThree
    );
    availableCups.splice(
      availableCups.indexOf(destinationCupLabel) + 1,
      0,
      cupTwo
    );
    availableCups.splice(
      availableCups.indexOf(destinationCupLabel) + 1,
      0,
      cupOne
    );

    // The crab selects a new current cup: the cup which is immediately clockwise of the current cup.
    currentCup =
      (availableCups.indexOf(currentCupLabel) + 1) % availableCups.length;
  }

  return [
    ...availableCups.slice(availableCups.indexOf(1) + 1),
    ...availableCups.slice(0, availableCups.indexOf(1)),
  ].join("");
};

const buildCupCircle = (initialCups, totalCups = 1_000_000) => {
  const lookup = new Map();

  for (let i = 0; i < totalCups; i++) {
    if (i < initialCups.length - 1) {
      lookup.set(initialCups[i], initialCups[i + 1]);
      continue;
    }

    if (i === initialCups.length - 1) {
      lookup.set(initialCups[i], i + 2);
      continue;
    }

    lookup.set(i + 1, i + 2);
  }

  lookup.set(totalCups, initialCups[0]);

  return [Math.min(...initialCups), totalCups, lookup];
};

const part2 = (cups) => {
  const [minCupLabel, maxCupLabel, cupCircle] = buildCupCircle(cups);
  let currentCupLabel = cups[0];

  for (let i = 0; i < 10_000_000; i++) {
    // The crab picks up the three cups that are immediately clockwise of the current cup.
    const cupOne = cupCircle.get(currentCupLabel);
    const cupTwo = cupCircle.get(cupOne);
    const cupThree = cupCircle.get(cupTwo);

    // The crab selects a destination cup: the cup with a label equal to the current cup's label minus one.
    let destinationCupLabel =
      currentCupLabel > minCupLabel ? currentCupLabel - 1 : maxCupLabel;

    // If this would select one of the cups that was just picked up, the crab will keep subtracting one until it finds a cup that wasn't just picked up.
    // If at any point in this process the value goes below the lowest value on any cup's label, it wraps around to the highest value on any cup's label instead.
    while ([cupOne, cupTwo, cupThree].includes(destinationCupLabel)) {
      destinationCupLabel =
        destinationCupLabel > minCupLabel
          ? destinationCupLabel - 1
          : maxCupLabel;
    }

    // The crab places the cups it just picked up so that they are immediately clockwise of the destination cup.
    // They keep the same order as when they were picked up.
    cupCircle.set(currentCupLabel, cupCircle.get(cupThree));
    cupCircle.set(cupThree, cupCircle.get(destinationCupLabel));
    cupCircle.set(destinationCupLabel, cupOne);

    // The crab selects a new current cup: the cup which is immediately clockwise of the current cup.
    currentCupLabel = cupCircle.get(currentCupLabel);
  }

  return cupCircle.get(1) * cupCircle.get(cupCircle.get(1));
};

const cups = require("fs")
  .readFileSync(process.argv[2], "utf-8")
  .split("")
  .map(Number);

console.log(part1(cups));
console.log(part2(cups));
