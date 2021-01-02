(ns aoc-2020.day-17-test
  (:require [clojure.test :refer [deftest testing is]]
            [aoc-2020.day-17 :refer [part-1 part-2]]))

(def pocket-dimesion (clojure.string/trim "
.#.
..#
###
"))

(deftest threed-six-cycle-boot-process
  (let [expected 112]
    (is (= expected (part-1 pocket-dimesion)))))

(deftest fourd-six-cycle-boot-process
  (let [expected 848]
    (is (= expected (part-2 pocket-dimesion)))))
