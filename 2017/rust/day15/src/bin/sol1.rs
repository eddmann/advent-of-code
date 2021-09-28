fn main() {
    let input = include_str!("../input.txt");
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

fn gen(initial: u64, factor: u64, multiple_of: u64) -> impl Iterator<Item = u64> {
    let succ = move |value: &u64| {
        let mut next_value = *value;
        loop {
            next_value = (next_value * factor) % 2147483647;
            if next_value % multiple_of == 0 {
                return Some(next_value);
            }
        }
    };

    std::iter::successors(succ(&initial), succ)
}

fn duel<T: Iterator<Item = u64>>(a: T, b: T, sample: usize) -> usize {
    a.zip(b)
        .take(sample)
        .filter(|&(a, b)| a as u16 == b as u16)
        .count()
}

fn part1(input: &str) -> usize {
    let (a, b) = parse_gen_initial_values(input);

    duel(gen(a, 16807, 1), gen(b, 48271, 1), 40_000_000)
}

fn part2(input: &str) -> usize {
    let (a, b) = parse_gen_initial_values(input);

    duel(gen(a, 16807, 4), gen(b, 48271, 8), 5_000_000)
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
