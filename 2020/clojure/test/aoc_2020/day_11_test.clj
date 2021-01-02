(ns aoc-2020.day-11-test
  (:require [clojure.test :refer [deftest testing is]]
            [aoc-2020.day-11 :refer [part-1 part-2]]))

(def seat-layout (clojure.string/trim "
L.LL.LL.LL
LLLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLLL
L.LLLLLL.L
L.LLLLL.LL
"))

(deftest occupied-seats
  (let [expected 37]
    (is (= expected (part-1 seat-layout)))))

(deftest occupied-seats-within-sight
  (let [expected 26]
    (is (= expected (part-2 seat-layout)))))
