(ns aoc-2020.day-06
  (:require [clojure.string :as str]
            [clojure.set :as set]))

(defn- parse-groups [input]
  (map #(map set (str/split-lines %1))
       (str/split input #"\n\n")))

(defn part-1
  "Day 06 Part 1"
  [input]
  (reduce #(+ %1 (count (apply set/union %2)))
          0
          (parse-groups input)))

(defn part-2
  "Day 06 Part 2"
  [input]
  (reduce #(+ %1 (count (apply set/intersection %2)))
          0
          (parse-groups input)))
