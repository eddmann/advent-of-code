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
        pos = (pos + steps) % buffer.len();
        buffer.insert(pos + 1, value);
        pos += 1
    }

    buffer[pos + 1]
}

fn part2(input: &str) -> usize {
    let steps = input.parse::<usize>().expect("Step size");

    let mut pos = 0;
    let mut second_value = 0;

    for value in 1..=50000000 {
        pos = (pos + steps) % value;
        if pos == 0 {
            second_value = value; // aka. pos + 1
        }
        pos += 1
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
