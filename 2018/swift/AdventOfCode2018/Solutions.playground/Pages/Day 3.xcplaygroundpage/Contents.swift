import Foundation

struct Claim {
    let id: Int
    let x: Int
    let y: Int
    let width: Int
    let height: Int
}

struct Square: Hashable {
  let x: Int, y: Int
}

let claims = read(file: "input").lines().map {
    let line = $0.ints()
    return Claim(id: line[0], x: line[1], y: line[2], width: line[3], height: line[4])
}

func computeSquares(for claim: Claim) -> [Square] {
    return (claim.x..<(claim.x + claim.width)).flatMap { x in
        (claim.y..<(claim.y + claim.height)).map { y in Square(x: x, y: y) }
    }
}

func computeFabric(for claims: [Claim]) -> [Square: Int] {
    var count = [Square: Int]()
    
    for claim in claims {
        for square in computeSquares(for: claim) {
            count[square, default: 0] += 1
        }
    }
    
    return count
}

func partOne() -> CustomStringConvertible {
    computeFabric(for: claims).filter({ $0.value > 1 }).count
}

func partTwo() -> CustomStringConvertible {
    let fabric = computeFabric(for: claims)
    let claim = claims.first(where: { claim in
        computeSquares(for: claim).allSatisfy({ fabric[$0] == 1})
    })
    
    return claim!.id
}

print(partOne())
print(partTwo())
