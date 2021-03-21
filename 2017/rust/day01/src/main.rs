use std::io::{self, Read};

fn main() -> io::Result<()> {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input)?;

    println!("solution 1, part 1: {0}", solution1_part1(&input));
    println!("solution 1, part 2: {0}", solution1_part2(&input));
    println!("solution 2, part 1: {0}", solution2_part1(&input));
    println!("solution 2, part 2: {0}", solution2_part2(&input));

    Ok(())
}

fn parse_numbers(input: &str) -> Vec<i32> {
    return input.chars().map(|x| (x.to_string()).parse::<i32>().unwrap()).collect();
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

    return numbers.iter()
        .zip(numbers.iter().cycle().skip(1))
        .filter_map(|(a, b)| if a == b { Some(a) } else { None })
        .sum();
}

fn solution2_part2(input: &str) -> i32 {
    let numbers = parse_numbers(input);

    return numbers.iter()
        .zip(numbers.iter().cycle().skip(numbers.len() / 2))
        .filter_map(|(a, b)| if a == b { Some(a) } else { None })
        .sum();
}
