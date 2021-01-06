(ns aoc-2020.day-13
  (:require [clojure.string :as str]))

(defn parse-bus-notes [input]
  (let [[departure bus-ids] (str/split-lines input)]
    {:departure (read-string departure)
     :bus-ids (->> (str/split bus-ids #",")
                   (map-indexed #(when-not (= %2 "x") [(read-string %2) %1]))
                   (remove nil?))}))

(defn part-1
  "Day 13 Part 1"
  [input]
  (let [{:keys [departure bus-ids]} (parse-bus-notes input)]
    (->> bus-ids
         (map (fn [[id]] [id (- id (mod departure id))]))
         (sort-by second)
         first
         (apply *))))

(defn part-2
  "Day 13 Part 2"
  [input]
  (let [{:keys [bus-ids]} (parse-bus-notes input)]
    (->> (reduce
           (fn [{:keys [multiplier timestamp]} [id offset]]
             (loop [ts timestamp]
               (if (zero? (mod (+ ts offset) id))
                 {:multiplier (* multiplier id) :timestamp ts}
                 (recur (+ ts multiplier)))))
             {:multiplier 1 :timestamp 0}
             bus-ids)
         :timestamp)))
