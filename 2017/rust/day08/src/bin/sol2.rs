fn main() {
    let input = include_str!("../input.txt");
    println!("Solution 2, Part 1: {}", part1(input));
    println!("Solution 2, Part 2: {}", part2(input));
}

type Register = std::collections::HashMap<String, i32>;

fn execute<F: Fn(&Register, T) -> T, T: Default>(program: &str, on_register_update: F) -> T {
    let mut register = Register::new();
    let mut result = T::default();

    for line in program.lines() {
        let instruction: Vec<_> = line.split_whitespace().collect();

        let condition_register_value = *register.entry(instruction[4].to_string()).or_default();
        let condition_value = instruction[6].parse::<i32>().expect("Condition value");
        let is_condition_met = match instruction[5] {
            ">" => condition_register_value > condition_value,
            "<" => condition_register_value < condition_value,
            ">=" => condition_register_value >= condition_value,
            "<=" => condition_register_value <= condition_value,
            "==" => condition_register_value == condition_value,
            "!=" => condition_register_value != condition_value,
            _ => panic!("Invalid condition"),
        };

        if !is_condition_met {
            continue;
        }

        let value = instruction[2].parse::<i32>().expect("Operation value");

        *register.entry(instruction[0].to_string()).or_default() += match instruction[1] {
            "inc" => value,
            "dec" => -value,
            _ => panic!("Invalid operation"),
        };

        result = on_register_update(&register, result);
    }

    result
}

fn part1(input: &str) -> i32 {
    execute(input, |registers, _| {
        *registers.values().max().expect("Max register value")
    })
}

fn part2(input: &str) -> i32 {
    execute(input, |registers, result| {
        std::cmp::max(
            result,
            *registers.values().max().expect("Max register value"),
        )
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_part1() {
        assert_eq!(
            1,
            part1("b inc 5 if a > 1\na inc 1 if b < 5\nc dec -10 if a >= 1\nc inc -20 if c == 10")
        );
    }

    #[test]
    fn test_part2() {
        assert_eq!(
            10,
            part2("b inc 5 if a > 1\na inc 1 if b < 5\nc dec -10 if a >= 1\nc inc -20 if c == 10")
        );
    }
}
