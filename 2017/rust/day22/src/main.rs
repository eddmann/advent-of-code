fn main() {
    let input = include_str!("input.txt");
    println!("Solution 1, Part 1: {}", part1(input));
    println!("Solution 1, Part 2: {}", part2(input));
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
struct Point2D(i32, i32);

#[derive(Debug, Clone, Copy)]
enum Node {
    Clean,
    Weakened,
    Infected,
    Flagged,
}

#[derive(Debug, Clone, Copy)]
struct VirusCarrier {
    position: Point2D,
    direction: Point2D,
}

impl VirusCarrier {
    fn turn_left(&self) -> Self {
        let Point2D(dx, dy) = self.direction;
        Self {
            position: self.position,
            direction: Point2D(-dy, dx),
        }
    }

    fn turn_right(&self) -> Self {
        let Point2D(dx, dy) = self.direction;
        Self {
            position: self.position,
            direction: Point2D(dy, -dx),
        }
    }

    fn turn_around(self) -> Self {
        let Point2D(dx, dy) = self.direction;
        Self {
            position: self.position,
            direction: Point2D(-dx, -dy),
        }
    }

    fn step(&self) -> Self {
        let Point2D(x, y) = self.position;
        let Point2D(dx, dy) = self.direction;
        Self {
            position: Point2D(x + dx, y + dy),
            direction: self.direction,
        }
    }
}

type ClusterMap = std::collections::HashMap<Point2D, Node>;

fn parse_computing_cluster(input: &str) -> (ClusterMap, VirusCarrier) {
    let mut cluster = ClusterMap::new();
    let lines: Vec<_> = input.split('\n').collect();

    let centre = (lines.len() / 2) as i32;
    let carrier = VirusCarrier {
        position: Point2D(centre, centre),
        direction: Point2D(-1, 0),
    };

    for (x, line) in lines.into_iter().enumerate() {
        for (y, node) in line.chars().enumerate() {
            if node == '#' {
                cluster.insert(Point2D(x as i32, y as i32), Node::Infected);
            }
        }
    }

    (cluster, carrier)
}

type BurstAction = fn(&Node, &VirusCarrier) -> (Node, VirusCarrier);

fn bursts(input: &str, total_bursts: usize, burst: BurstAction) -> i32 {
    let (mut cluster, mut carrier) = parse_computing_cluster(input);
    let mut total_infections = 0;

    for _ in 0..total_bursts {
        let (node, next_carrier) = burst(
            cluster.get(&carrier.position).unwrap_or(&Node::Clean),
            &carrier,
        );

        cluster.insert(carrier.position, node);
        carrier = next_carrier;

        total_infections += match node {
            Node::Infected => 1,
            _ => 0,
        };
    }

    total_infections
}

fn part1(input: &str) -> i32 {
    bursts(
        input,
        10_000,
        |node: &Node, carrier: &VirusCarrier| match node {
            Node::Clean => (Node::Infected, carrier.turn_left().step()),
            _ => (Node::Clean, carrier.turn_right().step()),
        },
    )
}

fn part2(input: &str) -> i32 {
    bursts(
        input,
        10_000_000,
        |node: &Node, carrier: &VirusCarrier| match node {
            Node::Clean => (Node::Weakened, carrier.turn_left().step()),
            Node::Weakened => (Node::Infected, carrier.step()),
            Node::Infected => (Node::Flagged, carrier.turn_right().step()),
            Node::Flagged => (Node::Clean, carrier.turn_around().step()),
        },
    )
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_part1() {
        assert_eq!(5587, part1("..#\n#..\n..."))
    }

    #[test]
    fn test_part2() {
        assert_eq!(2511944, part2("..#\n#..\n..."))
    }
}
