(ns aoc-2020.day-05
  (:require [clojure.string :as str]))

(defn- parse-boarding-passes [input]
  (sort (map location->seat-id (str/split-lines input))))

(defn- to-decimal [location]
  (->> (replace {\F 0 \B 1 \L 0 \R 1} location)
       str/join
       (#(Integer/parseInt %1 2))))

(defn- location->seat-id [location]
  (+ (* (to-decimal (take 7 location)) 8)
     (to-decimal (drop 7 location))))

(defn part-1
  "Day 05 Part 1"
  [input]
  (last (parse-boarding-passes input)))

(defn part-2
  "Day 05 Part 2"
  [input]
  (reduce
    #(if (> (- %2 %1) 1) (reduced (inc %1)) %2)
    (parse-boarding-passes input)))
