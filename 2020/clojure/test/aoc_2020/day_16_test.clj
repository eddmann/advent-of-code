(ns aoc-2020.day-16-test
  (:require [clojure.test :refer [deftest testing is]]
            [aoc-2020.day-16 :refer [part-1 part-2]]))

(def ticket-notes-1 (clojure.string/trim "
class: 1-3 or 5-7
row: 6-11 or 33-44
seat: 13-40 or 45-50

your ticket:
7,1,14

nearby tickets:
7,3,47
40,4,50
55,2,20
38,6,12
"))

(deftest calculate-ticket-scanning-error-rate
  (let [expected 71]
    (is (= expected (part-1 ticket-notes-1)))))

(def ticket-notes-2 (clojure.string/trim "
departure class: 0-1 or 4-19
row: 0-5 or 8-19
departure seat: 0-13 or 16-19

your ticket:
11,12,13

nearby tickets:
3,9,18
15,1,5
5,14,9
"))

(deftest product-of-departure-columns
  (let [expected 156]
    (is (= expected (part-2 ticket-notes-2)))))
