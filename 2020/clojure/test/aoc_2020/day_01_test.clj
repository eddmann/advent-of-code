(ns aoc-2020.day-01-test
  (:require [clojure.test :refer [deftest testing is]]
            [aoc-2020.day-01 :refer [part-1 part-2]]))

(def report (clojure.string/trim "
1721
979
366
299
675
1456
"))

(deftest find-two-entries-that-sum-to-2020
  (let [expected 514579]
    (is (= expected (part-1 report)))))

(deftest find-three-entries-that-sum-to-2020
  (let [expected 241861950]
    (is (= expected (part-2 report)))))
