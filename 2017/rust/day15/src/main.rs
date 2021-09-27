fn main() {
    let input = include_str!("input.txt");
    println!("Solution 1, Part 1: {}", part1(input));
    println!("Solution 1, Part 2: {}", part2(input));
}

fn parse_gen_initial_values(input: &str) -> (u64, u64) {
    let mut parts = input.lines().map(|line| {
        line.split_whitespace()
            .collect::<Vec<&str>>()
            .last()
            .expect("Generator value")
            .parse::<u64>()
            .expect("Numeric generator value")
    });
    (
        parts.next().expect("Generator A"),
        parts.next().expect("Generator B"),
    )
}

struct Generator {
    value: u64,
    factor: u64,
    multiple_of: Option<u64>,
}

impl Iterator for Generator {
    type Item = u64;

    fn next(&mut self) -> Option<u64> {
        loop {
            self.value = (self.value * self.factor) % 2147483647;

            match self.multiple_of {
                Some(multiple_of) if self.value % multiple_of == 0 => return Some(self.value),
                None => return Some(self.value),
                _ => (),
            }
        }
    }
}

fn duel(a: Generator, b: Generator, sample: usize) -> usize {
    a.zip(b)
        .take(sample)
        .filter(|&(a, b)| a as u16 == b as u16)
        .count()
}

fn part1(input: &str) -> usize {
    let (a, b) = parse_gen_initial_values(input);

    duel(
        Generator {
            value: a,
            factor: 16807,
            multiple_of: None,
        },
        Generator {
            value: b,
            factor: 48271,
            multiple_of: None,
        },
        40_000_000,
    )
}

fn part2(input: &str) -> usize {
    let (a, b) = parse_gen_initial_values(input);

    duel(
        Generator {
            value: a,
            factor: 16807,
            multiple_of: Some(4),
        },
        Generator {
            value: b,
            factor: 48271,
            multiple_of: Some(8),
        },
        5_000_000,
    )
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_part1() {
        assert_eq!(588, part1("65\n8921"))
    }

    #[test]
    fn test_part2() {
        assert_eq!(309, part2("65\n8921"))
    }
}
