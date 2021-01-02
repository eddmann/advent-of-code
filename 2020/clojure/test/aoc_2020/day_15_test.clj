(ns aoc-2020.day-15-test
  (:require [clojure.test :refer [deftest testing is]]
            [aoc-2020.day-15 :refer [part-1 part-2]]))

(deftest find-2020-number-said
  (let [expected 436]
    (is (= expected (part-1 "0,3,6")))))
