(ns aoc-2020.day-06
  (:require [clojure.string :refer (split)]
            [clojure.set :refer (union intersection)]))

(defn- parse-groups [input]
  (map #(map set (split %1 #"\n"))
       (split input #"\n\n")))

(defn part-1
  "Day 06 Part 1"
  [input]
  (->> (parse-groups input)
       (reduce #(+ %1 (count (apply union %2))) 0)))

(defn part-2
  "Day 06 Part 2"
  [input]
  (->> (parse-groups input)
       (reduce #(+ %1 (count (apply intersection %2))) 0)))
