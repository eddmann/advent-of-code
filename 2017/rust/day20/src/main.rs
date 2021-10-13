use regex::Regex;
use std::collections::HashMap;
use std::ops::Add;
use std::str::FromStr;

fn main() {
    let input = include_str!("input.txt");
    println!("Solution 1, Part 1: {}", part1(input));
    println!("Solution 1, Part 2: {}", part2(input));
}

#[derive(Debug, Copy, Clone, Hash, Eq, PartialEq)]
struct Point3D(i32, i32, i32);

impl Add for Point3D {
    type Output = Self;

    fn add(self, other: Self) -> Self {
        let Point3D(x, y, z) = self;
        let Point3D(ox, oy, oz) = other;
        Self(x + ox, y + oy, z + oz)
    }
}

#[derive(Debug)]
struct Particle {
    position: Point3D,
    velocity: Point3D,
    acceleration: Point3D,
}

impl Particle {
    fn tick(&mut self) {
        self.velocity = self.velocity + self.acceleration;
        self.position = self.position + self.velocity;
    }

    fn manhattan_distance(&self) -> i32 {
        let Point3D(x, y, z) = self.position;
        return x.abs() + y.abs() + z.abs();
    }
}

impl FromStr for Particle {
    type Err = &'static str;

    fn from_str(line: &str) -> Result<Particle, Self::Err> {
        let re = Regex::new(r"<(?P<x>-?\d+),(?P<y>-?\d+),(?P<z>-?\d+)>").expect("");
        let properties: Vec<_> = re
            .captures_iter(line)
            .map(|c| {
                Point3D(
                    c.name("x").expect("X").as_str().parse().expect("Integer X"),
                    c.name("y").expect("Y").as_str().parse().expect("Integer Y"),
                    c.name("z").expect("Z").as_str().parse().expect("Integer Z"),
                )
            })
            .collect();

        Ok(Particle {
            position: properties[0],
            velocity: properties[1],
            acceleration: properties[2],
        })
    }
}

fn parse_particles(input: &str) -> Vec<Particle> {
    input
        .split('\n')
        .map(|p| p.parse().expect("Particle"))
        .collect()
}

fn part1(input: &str) -> usize {
    let mut particles = parse_particles(input);

    for _ in 0..500 {
        particles.iter_mut().for_each(|p| p.tick());
    }

    let (id, _) = particles
        .iter()
        .enumerate()
        .min_by_key(|(_, p)| p.manhattan_distance())
        .expect("Closest particle");

    id
}

fn part2(input: &str) -> usize {
    let mut particles = parse_particles(input);

    for _ in 0..500 {
        let mut occurrences = HashMap::<Point3D, i32>::new();

        for p in particles.iter_mut() {
            p.tick();
            *occurrences.entry(p.position).or_insert(0) += 1;
        }

        particles.retain(|p| occurrences[&p.position] == 1);
    }

    particles.len()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_part1() {
        assert_eq!(
            0,
            part1("p=<3,0,0>, v=<2,0,0>, a=<-1,0,0>\np=<4,0,0>, v=<0,0,0>, a=<-2,0,0>")
        );
    }

    #[test]
    fn test_part2() {
        assert_eq!(
            1,
            part2("p=<-6,0,0>, v=<3,0,0>, a=<0,0,0>\np=<-4,0,0>, v=<2,0,0>, a=<0,0,0>\np=<-2,0,0>, v=<1,0,0>, a=<0,0,0>\np=<3,0,0>, v=<-1,0,0>, a=<0,0,0>")
        );
    }
}
