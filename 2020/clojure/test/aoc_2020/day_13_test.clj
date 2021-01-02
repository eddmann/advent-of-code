(ns aoc-2020.day-13-test
  (:require [clojure.test :refer [deftest testing is]]
            [aoc-2020.day-13 :refer [part-1 part-2]]))

(def bus-notes (clojure.string/trim "
939
7,13,x,x,59,x,31,19
"))

(deftest earliest-bus
  (let [expected 295]
    (is (= expected (part-1 bus-notes)))))

(deftest earliest-bus-with-offsets
  (let [expected 1068781]
    (is (= expected (part-2 bus-notes)))))
