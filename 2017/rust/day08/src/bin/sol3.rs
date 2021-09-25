use std::str::FromStr;

fn main() {
    let input = include_str!("../input.txt");
    println!("Solution 3, Part 1: {}", part1(input));
    println!("Solution 3, Part 2: {}", part2(input));
}

#[derive(Debug)]
enum Operation {
    Increment(String, i32),
    Decrement(String, i32),
}

impl Operation {
    fn apply(self, registers: &mut Registers) {
        match self {
            Operation::Increment(var, val) => *registers.entry(var.to_string()).or_insert(0) += val,
            Operation::Decrement(var, val) => *registers.entry(var.to_string()).or_insert(0) -= val,
        }
    }
}

impl FromStr for Operation {
    type Err = String;

    fn from_str(line: &str) -> Result<Operation, Self::Err> {
        let instruction: Vec<_> = line.split_whitespace().collect();

        let var = instruction[0].to_owned();
        let val = instruction[2].parse::<i32>().expect("Operation value");

        match instruction[1] {
            "inc" => Ok(Operation::Increment(var, val)),
            "dec" => Ok(Operation::Decrement(var, val)),
            _ => Err("Invalid operation".to_string()),
        }
    }
}

#[derive(Debug)]
enum Predicate {
    Greater(String, i32),
    GreaterEqual(String, i32),
    Less(String, i32),
    LessEqual(String, i32),
    Equal(String, i32),
    NotEqual(String, i32),
}

impl Predicate {
    fn is_valid(self, registers: &Registers) -> bool {
        match self {
            Predicate::Greater(var, val) => *registers.get(&var).unwrap_or(&0) > val,
            Predicate::GreaterEqual(var, val) => *registers.get(&var).unwrap_or(&0) >= val,
            Predicate::Less(var, val) => *registers.get(&var).unwrap_or(&0) < val,
            Predicate::LessEqual(var, val) => *registers.get(&var).unwrap_or(&0) <= val,
            Predicate::Equal(var, val) => *registers.get(&var).unwrap_or(&0) == val,
            Predicate::NotEqual(var, val) => *registers.get(&var).unwrap_or(&0) != val,
        }
    }
}

impl FromStr for Predicate {
    type Err = String;

    fn from_str(line: &str) -> Result<Predicate, Self::Err> {
        let instruction: Vec<_> = line.split_whitespace().collect();

        let var = instruction[4].to_owned();
        let val = instruction[6].parse::<i32>().expect("Operation value");

        match instruction[5] {
            ">" => Ok(Predicate::Greater(var, val)),
            ">=" => Ok(Predicate::GreaterEqual(var, val)),
            "<" => Ok(Predicate::Less(var, val)),
            "<=" => Ok(Predicate::LessEqual(var, val)),
            "==" => Ok(Predicate::Equal(var, val)),
            "!=" => Ok(Predicate::NotEqual(var, val)),
            _ => Err("Invalid predicate".to_string()),
        }
    }
}

#[derive(Debug)]
struct Instruction(Operation, Predicate);

impl Instruction {
    fn execute(self, registers: &mut Registers) {
        let Instruction(operation, predicate) = self;
        if predicate.is_valid(registers) {
            operation.apply(registers)
        }
    }

    fn from_program(program: &str) -> Vec<Instruction> {
        program
            .lines()
            .map(|instruction| instruction.parse().expect("Instruction"))
            .collect()
    }
}

impl FromStr for Instruction {
    type Err = String;

    fn from_str(instruction: &str) -> Result<Instruction, Self::Err> {
        Ok(Instruction(
            instruction.parse::<Operation>()?,
            instruction.parse::<Predicate>()?,
        ))
    }
}

type Registers = std::collections::HashMap<String, i32>;

fn part1(input: &str) -> i32 {
    let mut registers: Registers = Registers::new();

    for instruction in Instruction::from_program(input) {
        instruction.execute(&mut registers);
    }

    *registers.values().max().expect("Max register value")
}

fn part2(input: &str) -> i32 {
    let mut registers: Registers = Registers::new();
    let mut max = <i32>::min_value();

    for instruction in Instruction::from_program(input) {
        instruction.execute(&mut registers);
        max = std::cmp::max(max, *registers.values().max().unwrap_or(&max));
    }

    max
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
