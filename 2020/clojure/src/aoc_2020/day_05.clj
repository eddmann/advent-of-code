(ns aoc-2020.day-05
  (:require [clojure.string :as str]))

(defn- parse-boarding-passes [input]
  (str/split-lines input))

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
  (->> (parse-boarding-passes input)
       (map location->seat-id)
       (apply max)))

(defn part-2
  "Day 05 Part 2"
  [input]
  (loop [[x & ys] (->> (parse-boarding-passes input) (map location->seat-id) sort)]
    (cond
      (nil? x) nil
      (empty? ys) nil
      (= 1 (- (first ys) x)) (recur ys)
      :else (inc x))))
