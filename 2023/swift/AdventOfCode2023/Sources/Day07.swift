extension String {
  fileprivate func counts() -> [Character: Int] {
    var frequencies = [Character: Int]()

    self.forEach {
      frequencies[$0, default: 0] += 1
    }

    return frequencies
  }
}

struct Day07: AdventDay {
  var input: String

  enum HandType: Int {
    case HIGH_CARD, ONE_PAIR, TWO_PAIR, THREE_OF_A_KIND, FULL_HOUSE, FOUR_OF_A_KIND, FIVE_OF_A_KIND
  }

  class Hand: Comparable {
    let cards: String
    let bid: Int

    init(cards: String, bid: Int) {
      self.cards = cards
      self.bid = bid
    }

    func cardRanks() -> String {
      return "23456789TJQKA"
    }

    func type() -> HandType {
      let frequencies = self.cards.counts().values.sorted(by: >)

      switch frequencies {
      case [5]:
        return HandType.FIVE_OF_A_KIND
      case [4, 1]:
        return HandType.FOUR_OF_A_KIND
      case [3, 2]:
        return HandType.FULL_HOUSE
      case [3, 1, 1]:
        return HandType.THREE_OF_A_KIND
      case [2, 2, 1]:
        return HandType.TWO_PAIR
      case [2, 1, 1, 1]:
        return HandType.ONE_PAIR
      default:
        return HandType.HIGH_CARD
      }
    }

    static func < (lhs: Hand, rhs: Hand) -> Bool {
      if lhs.type().rawValue == rhs.type().rawValue {
        for pair in zip(lhs.cards, rhs.cards) {
          if lhs.cardRanks().firstIndex(of: pair.0)! != rhs.cardRanks().firstIndex(of: pair.1)! {
            return lhs.cardRanks().firstIndex(of: pair.0)! < lhs.cardRanks().firstIndex(of: pair.1)!
          }
        }

        return false
      }

      return lhs.type().rawValue < rhs.type().rawValue
    }

    static func == (lhs: Hand, rhs: Hand) -> Bool {
      lhs.cards == rhs.cards
    }
  }

  class WildJokerHand: Hand {
    override func cardRanks() -> String {
      return "J23456789TQKA"
    }

    override func type() -> HandType {
      let cardsWithoutJokers = self.cards.filter { $0 != "J" }

      if cardsWithoutJokers.isEmpty {
        return HandType.FIVE_OF_A_KIND
      }

      var frequencies = cardsWithoutJokers.counts().values.sorted(by: >)
      frequencies[0] += self.cards.count - cardsWithoutJokers.count

      switch frequencies {
      case [5]:
        return HandType.FIVE_OF_A_KIND
      case [4, 1]:
        return HandType.FOUR_OF_A_KIND
      case [3, 2]:
        return HandType.FULL_HOUSE
      case [3, 1, 1]:
        return HandType.THREE_OF_A_KIND
      case [2, 2, 1]:
        return HandType.TWO_PAIR
      case [2, 1, 1, 1]:
        return HandType.ONE_PAIR
      default:
        return HandType.HIGH_CARD
      }
    }
  }

  func winnings(from hands: [Hand]) -> Int {
    zip(1..., hands.sorted())
      .map { rank, hand in
        rank * hand.bid
      }
      .sum()
  }

  func part1() -> Any {
    let hands =
      input
      .lines()
      .map { line in
        let parsed = line.split(separator: " ")
        return Hand(cards: "\(parsed[0])", bid: Int(parsed[1])!)
      }

    return winnings(from: hands)
  }

  func part2() -> Any {
    let hands =
      input
      .lines()
      .map { line in
        let parsed = line.split(separator: " ")
        return WildJokerHand(cards: "\(parsed[0])", bid: Int(parsed[1])!)
      }

    return winnings(from: hands)
  }
}
