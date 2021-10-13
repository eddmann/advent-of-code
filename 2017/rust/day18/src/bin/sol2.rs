use std::sync::mpsc::{channel, Receiver, Sender};
use std::thread;
use std::time::Duration;

fn main() {
    let input = include_str!("../input.txt");
    println!("Solution 2, Part 1: {}", part1(input));
    println!("Solution 2, Part 2: {}", part2(input));
}

type Register = char;
type Registers = std::collections::HashMap<Register, i64>;
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

fn deref(registers: &Registers, v: Value) -> i64 {
    match v {
        Value::Reference(r) => *registers.get(&r).unwrap_or(&0),
        Value::Resolved(n) => n,
    }
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

fn execute(instructions: &Instructions, id: i64, inbox: Receiver<i64>, outbox: Sender<i64>) -> i64 {
    let mut registers = Registers::new();
    registers.insert('p', id);

    let mut pointer = 0;
    let mut total_sent_messages = 0;

    while let Some(&instruction) = instructions.get(pointer as usize) {
        match instruction {
            Instruction::Set(Value::Reference(r), v) => {
                registers.insert(r, deref(&registers, v));
            }
            Instruction::Add(Value::Reference(r), v) => {
                *registers.entry(r).or_insert(0) += deref(&registers, v);
            }
            Instruction::Mul(Value::Reference(r), v) => {
                *registers.entry(r).or_insert(0) *= deref(&registers, v);
            }
            Instruction::Mod(Value::Reference(r), v) => {
                *registers.entry(r).or_insert(0) %= deref(&registers, v);
            }
            Instruction::Jpz(x, y) => {
                if deref(&registers, x) > 0 {
                    pointer += deref(&registers, y);
                    continue;
                }
            }
            Instruction::Snd(x) => {
                if let Ok(_) = outbox.send(deref(&registers, x)) {
                    total_sent_messages += 1;
                }
            }
            Instruction::Rcv(Value::Reference(r)) => {
                if let Ok(n) = inbox.recv_timeout(Duration::from_millis(1)) {
                    registers.insert(r, n);
                } else {
                    break;
                }
            }
            _ => panic!("Unhandled instruction"),
        }

        pointer += 1;
    }

    total_sent_messages
}

fn part1(input: &str) -> i64 {
    let instructions = parse_instructions(input);

    let (_outbox0, inbox0) = channel();
    let (outbox1, inbox1) = channel();

    execute(&instructions, 0, inbox0, outbox1);

    let mut last_sent_value = 0;

    while let Ok(n) = inbox1.recv() {
        last_sent_value = n;
    }

    last_sent_value
}

fn part2(input: &str) -> i64 {
    let instructions0 = parse_instructions(input);
    let instructions1 = parse_instructions(input);

    let (outbox0, inbox0) = channel();
    let (outbox1, inbox1) = channel();

    let exec0 = thread::spawn(move || execute(&instructions0, 0, inbox0, outbox1));
    let exec1 = thread::spawn(move || execute(&instructions1, 1, inbox1, outbox0));

    exec0.join().unwrap();

    return exec1.join().unwrap();
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
