let input = read(file: "input")

enum Evaluation {
    case accepted, rejected, workflow(String)
    
    static func from(_ string: String) -> Self {
        switch string {
        case "A":
            return .accepted
        case "R":
            return .rejected
        default:
            return .workflow(string)
        }
    }
}

struct Workflow {
    let name: String
    let rules: [Rule]
    let fallback: Evaluation
    
    init(_ string: String) {
        let parts = string.components(separatedBy: "{")
        let rulesAndFallback = parts[1].dropLast().components(separatedBy: ",")
        name = parts[0]
        rules = rulesAndFallback.dropLast().map { Rule($0) }
        fallback = Evaluation.from(rulesAndFallback.last!)
    }
    
    func apply(to rating: Rating) -> Evaluation {
        for rule in rules {
            if let evaluation = rule.apply(to: rating) {
                return evaluation
            }
        }
        
        return fallback
    }
}

struct Rule {
    let category: Character
    let comparator: Comparator
    let value: Int
    let consequence: Evaluation
    
    init(_ string: String) {
        let parts = string.components(separatedBy: ":")
        category = Array(parts[0])[0]
        comparator = Comparator(rawValue: String(Array(parts[0])[1]))!
        value = Int(parts[0].dropFirst(2))!
        consequence = Evaluation.from(parts[1])
    }
    
    enum Comparator: String {
        case lt = "<"
        case gt = ">"
    }
    
    func apply(to rating: Rating) -> Evaluation? {
        switch comparator {
        case .lt:
            if rating[category] < value {
                return consequence
            }
        case .gt:
            if rating[category] > value {
                return consequence
            }
        }
        
        return nil
    }
}

struct Rating {
    let x, m, a, s: Int
    
    init(_ string: String) {
        let values = string.ints()
        x = values[0]
        m = values[1]
        a = values[2]
        s = values[3]
    }
    
    var total: Int { x + m + a + s }
    
    subscript(index: Character) -> Int {
        switch index {
        case "x": return x
        case "m": return m
        case "a": return a
        case "s": return s
        default: fatalError()
        }
    }
}

typealias Workflows = [String: Workflow]

typealias RatingRange = [Character: ClosedRange<Int>]

func parseWorkflowsAndRatings(_ input: String) -> (Workflows, [Rating]) {
    let workflowsAndRatings = input.split(separator: "\n\n").map { "\($0)".lines() }
    
    let workflows = workflowsAndRatings[0].map { input in
        let workflow = Workflow(input)
        return (workflow.name, workflow)
    }
    let ratings = workflowsAndRatings[1].map { Rating($0) }
    
    return (Dictionary(uniqueKeysWithValues: workflows), ratings)
}

func partOne() -> CustomStringConvertible {
    let (workflows, ratings) = parseWorkflowsAndRatings(input)
    
    func isAccepted(rating: Rating, at evaluation: Evaluation) -> Bool {
        switch evaluation {
        case .accepted:
            return true
        case .rejected:
            return false
        case .workflow(let name):
            return isAccepted(rating: rating, at: workflows[name]!.apply(to: rating))
        }
    }
    
    return ratings
        .map { isAccepted(rating: $0, at: .workflow("in")) ? $0.total : 0 }
        .reduce(0, +)
}

func partTwo() -> CustomStringConvertible {
    let (workflows, _) = parseWorkflowsAndRatings(input)
    
    func countCombinations(rating: RatingRange, at evaluation: Evaluation) -> Int {
        switch evaluation {
        case .accepted:
            return rating.values.reduce(1) { combinations, category in
                combinations * (category.upperBound - category.lowerBound + 1)
            }
        case .rejected:
            return 0
        case .workflow(let name):
            let workflow = workflows[name]!
            
            var currentRating = rating
            var combinations = 0
            
            for rule in workflow.rules {
                var (trues, falses) = (0...0, 0...0)
                
                switch rule.comparator {
                case .gt:
                    trues = rule.value + 1...currentRating[rule.category]!.upperBound
                    falses = currentRating[rule.category]!.lowerBound...rule.value
                case .lt:
                    trues = currentRating[rule.category]!.lowerBound...rule.value - 1
                    falses = rule.value...currentRating[rule.category]!.upperBound
                }
                
                if !trues.isEmpty {
                    var nextRating = currentRating
                    nextRating[rule.category]! = trues
                    combinations += countCombinations(rating: nextRating, at: rule.consequence)
                }
                
                if !falses.isEmpty {
                    currentRating[rule.category]! = falses
                }
            }
            
            return combinations + countCombinations(rating: currentRating, at: workflow.fallback)
        }
    }
    
    return countCombinations(
        rating: ["x": 1...4000, "m": 1...4000, "a": 1...4000, "s": 1...4000],
        at: .workflow("in")
    )
}

print(partOne())
print(partTwo())
