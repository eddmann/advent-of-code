fn main() {
    let input = include_str!("input.txt");
    println!("Solution 1, Part 1: {}", part1(input));
    println!("Solution 1, Part 2: {}", part2(input));
}

fn part1(input: &str) -> usize {
    let steps = input.parse::<usize>().expect("Step size");

    let mut pos = 0;
    let mut buffer = vec![0];

    for value in 1..=2017 {
        pos = (pos + steps) % buffer.len() + 1;
        buffer.insert(pos, value);
    }

    buffer[pos + 1]
}

fn part2(input: &str) -> usize {
    let steps = input.parse::<usize>().expect("Step size");

    let mut pos = 0;
    let mut second_value = 0;

    for value in 1..=50_000_000 {
        pos = (pos + steps) % value + 1;
        if pos == 1 {
            second_value = value;
        }
    }

    second_value
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_part1() {
        assert_eq!(638, part1("3"));
    }

    #[test]
    fn test_part2() {
        assert_eq!(1222153, part2("3"));
    }
}
