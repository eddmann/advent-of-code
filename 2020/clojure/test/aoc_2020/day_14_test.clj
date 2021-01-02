(ns aoc-2020.day-14-test
  (:require [clojure.test :refer [deftest testing is]]
            [aoc-2020.day-14 :refer [part-1 part-2]]))

(def program-1 (clojure.string/trim "
mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X
mem[8] = 11
mem[7] = 101
mem[8] = 0
"))

(deftest apply-mask-to-values
  (let [expected 165N]
    (is (= expected (part-1 program-1)))))


(def program-2 (clojure.string/trim "
mask = 000000000000000000000000000000X1001X
mem[42] = 100
mask = 00000000000000000000000000000000X0XX
mem[26] = 1
"))

(deftest decode-memory-addresses
  (let [expected 208]
    (is (= expected (part-2 program-2)))))
