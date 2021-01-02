(ns aoc-2020.day-18-test
  (:require [clojure.test :refer [deftest testing is]]
            [aoc-2020.day-18 :refer [part-1 part-2]]))

(def homework (clojure.string/trim "
2 * 3 + (4 * 5)
5 + (8 * 3 + 9 + 3 * 4 * 3)
5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))
((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2
"))

(deftest equal-operator-precedence
  (let [expected 26335]
    (is (= expected (part-1 homework)))))

(deftest higher-addition-operator-precedence
  (let [expected 693891]
    (is (= expected (part-2 homework)))))
