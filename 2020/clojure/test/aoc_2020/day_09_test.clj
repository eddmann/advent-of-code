(ns aoc-2020.day-09-test
  (:require [clojure.test :refer [deftest testing is]]
            [aoc-2020.day-09 :refer [part-1 part-2]]))

(def xmas-data (clojure.string/trim "
5

35
20
15
25
47
40
62
55
65
95
102
117
150
182
127
219
299
277
309
576
"))

(deftest find-weakness
  (let [expected 127]
    (is (= expected (part-1 xmas-data)))))

(deftest contiguous-sum
  (let [expected 62]
    (is (= expected (part-2 xmas-data)))))
