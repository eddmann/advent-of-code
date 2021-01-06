(ns aoc-2020.day-03
  (:require [clojure.string :as str]))

(defn- parse-map [input]
  (str/split-lines input))

(defn- total-trees [map [down right]]
  (let [map-width (count (first map))]
    (loop [remaining-map (drop down map)
           curr-pos right
           count 0]
      (if (empty? remaining-map)
        count
        (recur
          (drop down remaining-map)
          (mod (+ curr-pos right) map-width)
          (if (= \# (nth (first remaining-map) curr-pos)) (inc count) count))))))

(defn part-1
  "Day 03 Part 1"
  [input]
  (total-trees (parse-map input) [1 3]))

(defn part-2
  "Day 03 Part 2"
  [input]
  (apply * (map (partial total-trees (parse-map input))
                [[1 1] [1 3] [1 5] [1 7] [2 1]])))
