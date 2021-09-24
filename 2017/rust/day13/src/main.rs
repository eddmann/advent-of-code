fn main() {
    let input = include_str!("input.txt");
    println!("Solution 1, Part 1: {}", part1(input));
    println!("Solution 1, Part 2: {}", part2(input));
}

#[derive(Debug, Clone, Copy)]
enum Direction {
    Forward,
    Backward,
}

impl Direction {
    fn switch(self) -> Direction {
        match self {
            Self::Forward => Self::Backward,
            Self::Backward => Self::Forward,
        }
    }
}

#[derive(Debug, Clone, Copy)]
struct Scanner {
    range: usize,
    position: usize,
    direction: Direction,
}

impl Scanner {
    fn new(range: usize) -> Self {
        Scanner {
            range: range,
            position: 0,
            direction: Direction::Forward,
        }
    }

    fn tick(&mut self) {
        self.position = match self.direction {
            Direction::Forward => self.position + 1,
            Direction::Backward => self.position - 1,
        };

        if self.position == 0 || self.position == self.range - 1 {
            self.direction = self.direction.switch();
        }
    }

    fn is_caught(self) -> bool {
        self.position == 0
    }
}

type Layer = usize;
type Firewall = std::collections::HashMap<Layer, Scanner>;

fn parse_firewall(input: &str) -> Firewall {
    input
        .lines()
        .map(|line| {
            let mut parts = line.split(": ");
            let depth = parts.next().unwrap().parse::<usize>().unwrap();
            let range = parts.next().unwrap().parse::<usize>().unwrap();
            (depth, Scanner::new(range))
        })
        .collect()
}

fn part1(input: &str) -> usize {
    let mut firewall = parse_firewall(input);
    let mut severity = 0;

    for tick in 0..=*firewall.keys().max().unwrap() {
        if let Some(scanner) = firewall.get(&tick) {
            if scanner.is_caught() {
                severity += tick * scanner.range;
            }
        }

        for (_, scanner) in firewall.iter_mut() {
            scanner.tick();
        }
    }

    severity
}

fn is_undetected_passthru(subject_firewall: &Firewall) -> bool {
    let mut firewall = subject_firewall.clone();

    for tick in 0..=*firewall.keys().max().unwrap() {
        if let Some(scanner) = firewall.get(&tick) {
            if scanner.is_caught() {
                return false;
            }
        }

        for (_, scanner) in firewall.iter_mut() {
            scanner.tick();
        }
    }

    true
}

fn part2(input: &str) -> usize {
    let mut firewall = parse_firewall(input);
    let mut delay = 0;

    loop {
        if is_undetected_passthru(&firewall) {
            break;
        }

        for (_, scanner) in firewall.iter_mut() {
            scanner.tick();
        }

        delay += 1;
    }

    delay
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_part1() {
        assert_eq!(24, part1("0: 3\n1: 2\n4: 4\n6: 4"));
    }

    #[test]
    fn test_part2() {
        assert_eq!(10, part2("0: 3\n1: 2\n4: 4\n6: 4"));
    }
}
