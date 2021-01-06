(ns aoc-2020.day-11
  (:require [clojure.string :as str]))

(defn- parse-seat-layout [input]
  (mapv #(vec (char-array %)) (str/split-lines input)))

(def ^:private seat-neighbours
  (for [row-offset [-1 0 1]
        col-offset [-1 0 1]
        :when (not= [row-offset col-offset] [0 0])]
    [row-offset col-offset]))

(defn- count-occupied-seats [seat-layout row col seat-in-sight-check?]
  (reduce
    (fn [acc [row-offset col-offset]]
      (loop [curr-row (+ row row-offset)
             curr-col (+ col col-offset)]
        (let [seat (get-in seat-layout [curr-row curr-col])]
          (cond
            (= seat \#) (inc acc)
            (and (= seat \.) seat-in-sight-check?) (recur (+ curr-row row-offset) (+ curr-col col-offset))
            :else acc))))
    0
    seat-neighbours))

(defn- simulate-arrival [seat-layout min-occupied-seats seat-in-sight-check?]
  (reduce
    (fn [next-seat-layout [row col]]
      (let [occupied-seats (count-occupied-seats seat-layout row col seat-in-sight-check?)
            seat (get-in seat-layout [row col])]
        (cond
          (and (= seat \L) (zero? occupied-seats)) (assoc-in next-seat-layout [row col] \#)
          (and (= seat \#) (> occupied-seats min-occupied-seats)) (assoc-in next-seat-layout [row col] \L)
          :else next-seat-layout)))
    seat-layout
    (for [row (range 0 (count seat-layout)) col (range 0 (count (first seat-layout)))]
      [row col])))

(defn part-1
  "Day 11 Part 1"
  [input]
  (loop [prev-seat-layout nil
         seat-layout (simulate-arrival (parse-seat-layout input) 3 false)]
    (if (= prev-seat-layout seat-layout)
      (get (frequencies (flatten seat-layout)) \#)
      (recur seat-layout (simulate-arrival seat-layout 3 false)))))

(defn part-2
  "Day 11 Part 2"
  [input]
  (loop [prev-seat-layout nil
         seat-layout (simulate-arrival (parse-seat-layout input) 4 true)]
    (if (= prev-seat-layout seat-layout)
      (get (frequencies (flatten seat-layout)) \#)
      (recur seat-layout (simulate-arrival seat-layout 4 true)))))
