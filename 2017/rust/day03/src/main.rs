use std::collections::HashMap;

fn main() {
    let input = std::include_str!("input.txt").parse::<i32>().unwrap();
    println!("Solution 1, Part 1: {}", part1(input));
    println!("Solution 1, Part 2: {}", part2(input));
}

fn part1(input: i32) -> i32 {
    let mut dx = 1;
    let mut dy = 0;

    let mut x: i32 = 0;
    let mut y: i32 = 0;

    let mut total_steps = 1;
    let mut steps = 0;

    for number in 1..=input {
        if number == input {
            return x.abs() + y.abs();
        }

        x += dx;
        y += dy;
        steps += 1;

        if steps == total_steps {
            steps = 0;
            let tmp = dx;
            dx = -dy;
            dy = tmp;
            if dy == 0 { total_steps += 1; }
        }
    }

    return 0;
}

fn part2(input: i32) -> i32 {
    let mut map = HashMap::new();

    let mut dx = 1;
    let mut dy = 0;

    let mut x: i32 = 0;
    let mut y: i32 = 0;

    let mut total_steps = 1;
    let mut steps = 0;

    map.insert((x, y), 1);

    for _ in 1.. {
        x += dx;
        y += dy;
        steps += 1;

        let mut number = 0;
        for nx in -1..=1 {
            for ny in -1..=1 {
                if nx == 0 && ny == 0 { continue; }
                number += match map.get(&(x + nx, y +  ny)) {
                    Some(dv) => *dv,
                    _ => 0
                };
            }
        }

        if number > input {
            return number;
        }

        map.insert((x, y), number);

        if steps == total_steps {
            steps = 0;
            let tmp = dx;
            dx = -dy;
            dy = tmp;
            if dy == 0 { total_steps += 1; }
        }
    }

    return 0;
}
