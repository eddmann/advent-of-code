(ns aoc-2020.day-03-test
  (:require [clojure.test :refer [deftest testing is]]
            [aoc-2020.day-03 :refer [part-1 part-2]]))

(def tree-map (clojure.string/trim "
..##.......
#...#...#..
.#....#..#.
..#.#...#.#
.#...##..#.
..#.##.....
.#.#.#....#
.#........#
#.##...#...
#...##....#
.#..#...#.#
"))

(deftest trees-encountered-for-3-right-1-down
  (let [expected 7]
    (is (= expected (part-1 tree-map)))))

(deftest product-of-trees-encountered
  (let [expected 336]
    (is (= expected (part-2 tree-map)))))
