use std::fmt;
use std::str::FromStr;

fn main() {
    let input = include_str!("input.txt");
    println!("Solution 1, Part 1: {}", part1(input));
    println!("Solution 1, Part 2: {}", part2(input));
}

type Rules = std::collections::HashMap<Image, Image>;
type Pixel = bool;
type Subimage = (usize, usize, Image);

#[derive(Debug, Clone, Eq, PartialEq, Hash)]
struct Image {
    pixels: Vec<Pixel>,
    size: usize,
}

impl Image {
    fn empty(size: usize) -> Self {
        Image {
            pixels: vec![false; size * size],
            size: size,
        }
    }

    fn set_pixel(&mut self, row: usize, col: usize, pixel: Pixel) {
        self.pixels[row * self.size + col] = pixel;
    }

    fn get_pixel(&self, row: usize, col: usize) -> bool {
        self.pixels[row * self.size + col]
    }

    fn flip_vertical(&self) -> Self {
        let mut image = Self::empty(self.size);

        for row in 0..=image.size / 2 {
            for col in 0..image.size {
                image.set_pixel(row, col, self.get_pixel(image.size - row - 1, col));
                image.set_pixel(image.size - row - 1, col, self.get_pixel(row, col));
            }
        }

        image
    }

    fn rotate_clockwise(&self) -> Self {
        let mut image = Self::empty(self.size);

        for row in 0..image.size {
            for col in 0..image.size {
                image.set_pixel(col, image.size - row - 1, self.get_pixel(row, col));
            }
        }

        image
    }

    fn get_orientations(&self) -> Vec<Self> {
        let mut orientation = self.clone();
        let mut orientations = vec![];

        for _ in 0..4 {
            orientation = orientation.rotate_clockwise();
            orientations.push(orientation.clone());
        }

        orientations
    }

    fn get_subimage(&self, row: usize, col: usize, size: usize) -> Subimage {
        let mut subimage = Image::empty(size);

        for (dst_row, src_row) in (row..row + size).enumerate() {
            for (dst_col, src_col) in (col..col + size).enumerate() {
                subimage.set_pixel(dst_row, dst_col, self.get_pixel(src_row, src_col));
            }
        }

        (row, col, subimage)
    }

    fn get_subimages(&self, step: usize) -> Vec<Subimage> {
        let mut subimages = vec![];

        for row in (0..self.size).step_by(step) {
            for col in (0..self.size).step_by(step) {
                subimages.push(self.get_subimage(row, col, step));
            }
        }

        subimages
    }

    fn enhance(&self, rules: &Rules) -> Self {
        let step = if self.size % 2 == 0 { 2 } else { 3 };
        let mut expanded_image = Image::empty(self.size + self.size / step);

        for (src_row, src_col, subimage) in self.get_subimages(step) {
            let replacement = rules.get(&subimage).expect("Replacement image");
            let dst_row = src_row + src_row / step;
            let dst_col = src_col + src_col / step;

            for (src_row, dst_row) in (dst_row..(dst_row + replacement.size)).enumerate() {
                for (src_col, dst_col) in (dst_col..(dst_col + replacement.size)).enumerate() {
                    expanded_image.set_pixel(
                        dst_row,
                        dst_col,
                        replacement.get_pixel(src_row, src_col),
                    );
                }
            }
        }

        expanded_image
    }

    fn get_total_active_pixels(&self) -> usize {
        self.pixels.iter().filter(|&pixel| *pixel).count()
    }
}

impl FromStr for Image {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let pixels: Vec<bool> = s
            .chars()
            .filter_map(|pixel| match pixel {
                '#' => Some(true),
                '.' => Some(false),
                _ => None,
            })
            .collect();

        let size = ((pixels.len() as f64).sqrt()) as usize;

        Ok(Image {
            pixels: pixels,
            size: size,
        })
    }
}

impl fmt::Display for Image {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(
            f,
            "{}",
            self.pixels
                .chunks(self.size)
                .map(|row| {
                    row.iter()
                        .map(|&pixel| if pixel { '#' } else { '.' })
                        .collect::<String>()
                        + "\n"
                })
                .collect::<String>()
        )
    }
}

fn parse_rules(input: &str) -> Rules {
    let mut rules = Rules::new();

    for line in input.split('\n') {
        let split: Vec<_> = line.split(" => ").collect();

        let source: Image = split[0].parse().expect("Source image");
        let replacement: Image = split[1].parse().expect("Replacement image");

        for orientation in source.get_orientations() {
            rules.insert(orientation.flip_vertical(), replacement.clone());
            rules.insert(orientation, replacement.clone());
        }
    }

    rules
}

fn enhancer(initial_image: Option<Image>, rules: Rules) -> impl Iterator<Item = Image> {
    std::iter::successors(initial_image, move |image| Some(image.enhance(&rules)))
}

fn part1(input: &str) -> usize {
    enhancer(".#./..#/###".parse().ok(), parse_rules(input))
        .nth(5)
        .expect("Enhanced image")
        .get_total_active_pixels()
}

fn part2(input: &str) -> usize {
    enhancer(".#./..#/###".parse().ok(), parse_rules(input))
        .nth(18)
        .expect("Enhanced image")
        .get_total_active_pixels()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_enhancement() {
        let rules = parse_rules("../.# => ##./#../...\n.#./..#/### => #..#/..../..../#..#");
        let initial_image: Image = ".#./..#/###".parse().expect("Initial image");

        assert_eq!(4, initial_image.enhance(&rules).get_total_active_pixels());
        assert_eq!(
            12,
            initial_image
                .enhance(&rules)
                .enhance(&rules)
                .get_total_active_pixels()
        );
    }
}
