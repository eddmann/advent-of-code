(ns aoc-2020.day-10
  (:require [clojure.string :as str]))

(defn- parse-adapters [input]
  (sort (map read-string (str/split-lines input))))

(def total-adapter-arrangements
  (memoize
    (fn [adapters total]
      (if (empty? adapters)
        1
        (reduce
          (fn [acc t] (+ acc (total-adapter-arrangements (filter #(> % t) adapters) t)))
          0
          (take-while #(< (- % total) 4) adapters))))))

(defn part-1
  "Day 10 Part 1"
  [input]
  (->> (parse-adapters input)
       (reduce
         (fn [[acc prev] next] [(update acc (- next prev) inc) next])
         [{1 0 3 1} 0])
       first
       vals
       (apply *)))

(defn part-2
  "Day 10 Part 2"
  [input]
  (total-adapter-arrangements (parse-adapters input) 0))
