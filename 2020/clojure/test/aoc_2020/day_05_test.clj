(ns aoc-2020.day-05-test
  (:require [clojure.test :refer [deftest testing is]]
            [aoc-2020.day-05 :refer [part-1]]))

(def boarding-passes (clojure.string/trim "
FBFBBFFRLR
BFFFBBFRRR
FFFBBBFRRR
BBFFBBFRLL
"))

(deftest highest-boarding-pass-seat-id
  (let [expected 820]
    (is (= expected (part-1 boarding-passes)))))
