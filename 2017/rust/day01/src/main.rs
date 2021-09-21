fn main() {
    let input = include_str!("input.txt");
    println!("Solution 1, Part 1: {}", solution1_part1(input));
    println!("Solution 1, Part 2: {}", solution1_part2(input));
    println!("Solution 2, Part 1: {}", solution2_part1(input));
    println!("Solution 2, Part 2: {}", solution2_part2(input));
    println!("Solution 3, Part 1: {}", solution3_part1(input));
    println!("Solution 3, Part 2: {}", solution3_part2(input));
}

fn parse_numbers(input: &str) -> Vec<i32> {
    input
        .chars()
        .map(|x| (x.to_string()).parse::<i32>().unwrap())
        .collect()
}

fn solution1_part1(input: &str) -> i32 {
    let numbers = parse_numbers(input);
    let mut sum = 0;

    for (idx, num) in numbers.iter().enumerate() {
        if num == &numbers[(idx + 1) % numbers.len()] {
            sum += num;
        }
    }

    return sum;
}

fn solution1_part2(input: &str) -> i32 {
    let numbers = parse_numbers(input);
    let mut sum = 0;

    for (idx, num) in numbers.iter().enumerate() {
        if num == &numbers[(idx + numbers.len() / 2) % numbers.len()] {
            sum += num;
        }
    }

    return sum;
}

fn solution2_part1(input: &str) -> i32 {
    let numbers = parse_numbers(input);

    numbers
        .iter()
        .zip(numbers.iter().cycle().skip(1))
        .filter_map(|(a, b)| if a == b { Some(a) } else { None })
        .sum()
}

fn solution2_part2(input: &str) -> i32 {
    let numbers = parse_numbers(input);

    numbers
        .iter()
        .zip(numbers.iter().cycle().skip(numbers.len() / 2))
        .filter_map(|(a, b)| if a == b { Some(a) } else { None })
        .sum()
}

fn sum_pairs(numbers: Vec<i32>, step: usize) -> i32 {
    numbers.iter().enumerate().fold(0, |acc, (idx, num)| {
        if num == &numbers[(idx + step) % numbers.len()] {
            acc + num
        } else {
            acc
        }
    })
}

fn solution3_part1(input: &str) -> i32 {
    sum_pairs(parse_numbers(input), 1)
}

fn solution3_part2(input: &str) -> i32 {
    let numbers = parse_numbers(input);
    sum_pairs(parse_numbers(input), numbers.len() / 2)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_part1() {
        assert_eq!(3, solution1_part1("1122"));
        assert_eq!(3, solution2_part1("1122"));
        assert_eq!(3, solution3_part1("1122"));
        assert_eq!(9, solution1_part1("91212129"));
        assert_eq!(9, solution2_part1("91212129"));
        assert_eq!(9, solution3_part1("91212129"));
    }

    #[test]
    fn test_part2() {
        assert_eq!(6, solution1_part2("1212"));
        assert_eq!(6, solution2_part2("1212"));
        assert_eq!(6, solution3_part2("1212"));
        assert_eq!(12, solution1_part2("123123"));
        assert_eq!(12, solution2_part2("123123"));
        assert_eq!(12, solution3_part2("123123"));
    }
}
