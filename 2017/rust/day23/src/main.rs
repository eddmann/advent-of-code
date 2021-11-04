fn main() {
    let input = include_str!("input.txt");
    println!("Solution 1, Part 1: {}", part1(input));
    println!("Solution 1, Part 2: {}", part2(input));
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
    Set(Value, Value),
    Sub(Value, Value),
    Mul(Value, Value),
    Mod(Value, Value),
    Jnz(Value, Value),
}

struct Exectution {
    registers: Registers,
    pointer: i64,
    total_mul_executions: usize,
}

impl Exectution {
    fn deref(&self, v: Value) -> i64 {
        match v {
            Value::Reference(r) => *self.registers.get(&r).unwrap_or(&0),
            Value::Resolved(n) => n,
        }
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
        let tokens: Vec<_> = line.split(' ').collect();

        match tokens[0] {
            "set" => Instruction::Set(parse_value(tokens[1]), parse_value(tokens[2])),
            "sub" => Instruction::Sub(parse_value(tokens[1]), parse_value(tokens[2])),
            "mul" => Instruction::Mul(parse_value(tokens[1]), parse_value(tokens[2])),
            "mod" => Instruction::Mod(parse_value(tokens[1]), parse_value(tokens[2])),
            "jnz" => Instruction::Jnz(parse_value(tokens[1]), parse_value(tokens[2])),
            _ => panic!("Unknown instruction"),
        }
    }

    input.split('\n').map(|i| parse_instruction(i)).collect()
}

fn execute(instructions: &Instructions, execution: &mut Exectution) {
    while let Some(&instruction) = instructions.get(execution.pointer as usize) {
        match instruction {
            Instruction::Set(Value::Reference(r), v) => {
                execution.registers.insert(r, execution.deref(v));
            }
            Instruction::Sub(Value::Reference(r), v) => {
                *execution.registers.entry(r).or_insert(0) -= execution.deref(v);
            }
            Instruction::Mul(Value::Reference(r), v) => {
                *execution.registers.entry(r).or_insert(0) *= execution.deref(v);
                execution.total_mul_executions += 1;
            }
            Instruction::Mod(Value::Reference(r), v) => {
                *execution.registers.entry(r).or_insert(0) %= execution.deref(v);
            }
            Instruction::Jnz(x, y) => {
                if execution.deref(x) != 0 {
                    execution.pointer += execution.deref(y);
                    continue;
                }
            }
            _ => panic!("Unhandled instruction"),
        }

        execution.pointer += 1;
    }
}

fn part1(input: &str) -> usize {
    let instructions = parse_instructions(input);

    let mut exec = Exectution {
        registers: Registers::new(),
        pointer: 0,
        total_mul_executions: 0,
    };

    execute(&instructions, &mut exec);

    exec.total_mul_executions
}

fn part2(input: &str) -> i64 {
    let mut instructions = parse_instructions(input);

    let patch = parse_instructions("set g b\nmod g d\njnz g 8\njnz 1 12");
    let offset = 10;
    instructions.splice(offset..(offset + patch.len()), patch);

    let mut exec = Exectution {
        registers: Registers::new(),
        pointer: 0,
        total_mul_executions: 0,
    };

    exec.registers.insert('a', 1);

    execute(&instructions, &mut exec);

    *exec.registers.get(&'h').expect("Register H")
}
