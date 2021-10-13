fn main() {
    let input = include_str!("../input.txt");
    println!("Solution 1, Part 1: {}", part1(input));
    println!("Solution 1, Part 2: {}", part2(input));
}

type Register = char;
type Registers = std::collections::HashMap<Register, i64>;
type Mailbox = std::collections::VecDeque<i64>;
type Instructions = Vec<Instruction>;

#[derive(Copy, Clone)]
enum Value {
    Reference(Register),
    Resolved(i64),
}

#[derive(Copy, Clone)]
enum Instruction {
    Snd(Value),
    Rcv(Value),
    Set(Value, Value),
    Add(Value, Value),
    Mul(Value, Value),
    Mod(Value, Value),
    Jpz(Value, Value),
}

struct Exectution {
    registers: Registers,
    mailbox: Mailbox,
    pointer: i64,
}

impl Exectution {
    fn deref(&self, v: Value) -> i64 {
        match v {
            Value::Reference(r) => *self.registers.get(&r).unwrap_or(&0),
            Value::Resolved(n) => n,
        }
    }
}

enum ExecutionResult {
    Halted,
    Send(i64),
}

fn parse_value(v: &str) -> Value {
    match v.parse() {
        Ok(n) => Value::Resolved(n),
        Err(_) => Value::Reference(v.chars().next().expect("Register reference")),
    }
}

fn parse_instructions(input: &str) -> Instructions {
    fn parse_instruction(line: &str) -> Instruction {
        let (command, rest) = line.split_at(3);
        let args: Vec<_> = rest.trim().split(' ').collect();

        match command {
            "snd" => Instruction::Snd(parse_value(args[0])),
            "rcv" => Instruction::Rcv(parse_value(args[0])),
            "set" => Instruction::Set(parse_value(args[0]), parse_value(args[1])),
            "add" => Instruction::Add(parse_value(args[0]), parse_value(args[1])),
            "mul" => Instruction::Mul(parse_value(args[0]), parse_value(args[1])),
            "mod" => Instruction::Mod(parse_value(args[0]), parse_value(args[1])),
            "jgz" => Instruction::Jpz(parse_value(args[0]), parse_value(args[1])),
            _ => panic!("Unknown instruction"),
        }
    }

    input.split('\n').map(|i| parse_instruction(i)).collect()
}

fn execute(instructions: &Instructions, execution: &mut Exectution) -> ExecutionResult {
    while let Some(&instruction) = instructions.get(execution.pointer as usize) {
        match instruction {
            Instruction::Set(Value::Reference(r), v) => {
                execution.registers.insert(r, execution.deref(v));
            }
            Instruction::Add(Value::Reference(r), v) => {
                *execution.registers.entry(r).or_insert(0) += execution.deref(v);
            }
            Instruction::Mul(Value::Reference(r), v) => {
                *execution.registers.entry(r).or_insert(0) *= execution.deref(v);
            }
            Instruction::Mod(Value::Reference(r), v) => {
                *execution.registers.entry(r).or_insert(0) %= execution.deref(v);
            }
            Instruction::Jpz(x, y) => {
                if execution.deref(x) > 0 {
                    execution.pointer += execution.deref(y);
                    continue;
                }
            }
            Instruction::Snd(x) => {
                execution.pointer += 1;
                return ExecutionResult::Send(execution.deref(x));
            }
            Instruction::Rcv(Value::Reference(r)) => {
                if let Some(n) = execution.mailbox.pop_front() {
                    execution.registers.insert(r, n);
                } else {
                    return ExecutionResult::Halted;
                }
            }
            _ => panic!("Unhandled instruction"),
        }

        execution.pointer += 1;
    }

    ExecutionResult::Halted
}

fn part1(input: &str) -> i64 {
    let instructions = parse_instructions(input);

    let mut exec = Exectution {
        registers: Registers::new(),
        mailbox: Mailbox::new(),
        pointer: 0,
    };

    let mut last_sent_value = 0;

    loop {
        match execute(&instructions, &mut exec) {
            ExecutionResult::Send(number) => {
                last_sent_value = number;
            }
            ExecutionResult::Halted => {
                break;
            }
        }
    }

    last_sent_value
}

fn part2(input: &str) -> i64 {
    let instructions = parse_instructions(input);

    let mut exec0 = Exectution {
        registers: Registers::new(),
        mailbox: Mailbox::new(),
        pointer: 0,
    };
    exec0.registers.insert('p', 0);

    let mut exec1 = Exectution {
        registers: Registers::new(),
        mailbox: Mailbox::new(),
        pointer: 0,
    };
    exec1.registers.insert('p', 1);

    let mut total_sent_messages = 0;

    loop {
        match (
            execute(&instructions, &mut exec0),
            execute(&instructions, &mut exec1),
        ) {
            (ExecutionResult::Send(n0), ExecutionResult::Send(n1)) => {
                exec0.mailbox.push_back(n1);
                exec1.mailbox.push_back(n0);
                total_sent_messages += 1;
            }
            (ExecutionResult::Send(n0), _) => {
                exec1.mailbox.push_back(n0);
            }
            (_, ExecutionResult::Send(n1)) => {
                exec0.mailbox.push_back(n1);
                total_sent_messages += 1;
            }
            (ExecutionResult::Halted, ExecutionResult::Halted) => {
                break;
            }
        }
    }

    total_sent_messages
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_part1() {
        assert_eq!(4, part1("set a 1\nadd a 2\nmul a a\nmod a 5\nsnd a\nset a 0\nrcv a\njgz a -1\nset a 1\njgz a -2"));
    }

    #[test]
    fn test_part2() {
        assert_eq!(3, part2("snd 1\nsnd 2\nsnd p\nrcv a\nrcv b\nrcv c\nrcv d"));
    }
}
