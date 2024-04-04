import Foundation

precedencegroup ExponentiationPrecedence {
  associativity: right
  higherThan: MultiplicationPrecedence
}

infix operator ** : ExponentiationPrecedence

func ** (_ base: Decimal, _ exp: Int) -> Decimal {
  pow(base, exp)
}

struct Day04: AdventDay {
  var input: String

  struct Card {
    let id: Int
    let numbers: Set<Int>
    let winners: Set<Int>
  }

  func parseCards(_ input: String) -> [Card] {
    input.lines().map { line in
      let (_, id, numbers, winners) = line.firstMatch(of: /Card\s+(\d+): (.+) \| (.+)/)!.output
      return Card(
        id: Int(id)!, numbers: Set("\(numbers)".ints()), winners: Set("\(winners)".ints()))
    }
  }

  func part1() -> Any {
    parseCards(input)
      .map { (card) -> Decimal in
        let matches = card.numbers.intersection(card.winners).count
        return matches > 0 ? 2 ** (matches - 1) : 0
      }
      .sum()
  }

  func part2() -> Any {
    let cards = parseCards(input)
    var tally = Dictionary(uniqueKeysWithValues: cards.map { ($0.id, 1) })

    for card in cards {
      let matches = card.numbers.intersection(card.winners).count
      if matches == 0 { continue }

      for id in (card.id + 1)...(matches + card.id) {
        if !tally.keys.contains(id) { break }
        tally[id] = tally[id]! + tally[card.id]!
      }
    }

    return tally.values.sum()
  }
}
