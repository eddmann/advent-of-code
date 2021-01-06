(ns aoc-2020.day-15
  (:require [clojure.string :as str]))

(defn- parse-numbers [input]
  (map read-string (str/split input #",")))

; https://rosettacode.org/wiki/Van_Eck_sequence

(defn- say-next [numbers]
  (let [starting-numbers (butlast numbers)
        next-number (fn next [occurrences number turn]
                      (lazy-seq (cons number (next (assoc occurrences number turn)
                                                   (- turn (get occurrences number turn))
                                                   (inc turn)))))]
    (lazy-cat starting-numbers
              (next-number (into {} (map-indexed (fn [idx num] [num (inc idx)]) starting-numbers))
                           (last numbers)
                           (count numbers)))))

(defn part-1
  "Day 15 Part 1"
  [input]
  (nth (say-next (parse-numbers input))
       (dec 2020)))

(defn part-2
  "Day 15 Part 2"
  [input]
  (nth (say-next (parse-numbers input))
       (dec 30000000)))
