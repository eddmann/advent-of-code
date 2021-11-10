use std::cmp::Ordering;
use std::collections::HashSet;

fn main() {
    let input = include_str!("../input.txt");
    println!("Solution 2, Part 1: {}", part1(input));
    println!("Solution 2, Part 2: {}", part2(input));
}

#[derive(Clone, Eq, PartialEq, Hash, Copy)]
struct Component(usize, usize);

type Components = HashSet<Component>;

struct Bridge {
    strength: usize,
    length: usize,
}

type BridgeComparator = fn(a: &Bridge, b: &Bridge) -> Ordering;

fn parse_components(input: &str) -> Components {
    input
        .split('\n')
        .map(|component| {
            let ports: Vec<_> = component.split('/').collect();
            Component(
                ports[0].parse().expect("Port 1"),
                ports[1].parse().expect("Port 2"),
            )
        })
        .collect()
}

fn remove_component(components: &Components, component: Component) -> Components {
    let mut next_components = components.clone();
    next_components.remove(&component);
    next_components
}

fn calc_max_bridge(components: &Components, comparator: BridgeComparator) -> Bridge {
    fn recur(
        remaining_components: &Components,
        comparator: BridgeComparator,
        port: usize,
        bridge: Bridge,
    ) -> Bridge {
        remaining_components
            .iter()
            .filter_map(|&component| match component {
                Component(p1, p2) if p1 == port || p2 == port => Some(recur(
                    &remove_component(&remaining_components, component),
                    comparator,
                    if p1 == port { p2 } else { p1 },
                    Bridge {
                        strength: bridge.strength + p1 + p2,
                        length: bridge.length + 1,
                    },
                )),
                _ => None,
            })
            .max_by(comparator)
            .unwrap_or(bridge)
    }

    recur(
        components,
        comparator,
        0,
        Bridge {
            strength: 0,
            length: 0,
        },
    )
}

fn part1(input: &str) -> usize {
    calc_max_bridge(&parse_components(input), |a, b| a.strength.cmp(&b.strength)).strength
}

fn part2(input: &str) -> usize {
    calc_max_bridge(&parse_components(input), |a, b| {
        match a.length.cmp(&b.length) {
            Ordering::Equal => a.strength.cmp(&b.strength),
            order => order,
        }
    })
    .strength
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_part1() {
        assert_eq!(31, part1("0/2\n2/2\n2/3\n3/4\n3/5\n0/1\n10/1\n9/10"))
    }

    #[test]
    fn test_part2() {
        assert_eq!(19, part2("0/2\n2/2\n2/3\n3/4\n3/5\n0/1\n10/1\n9/10"))
    }
}
