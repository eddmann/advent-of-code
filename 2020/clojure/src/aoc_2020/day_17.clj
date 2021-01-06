(ns aoc-2020.day-17
  (:require [clojure.string :as str]
            [clojure.math.combinatorics :refer (cartesian-product)]))

(defn- parse-pocket-dimension [input dimensions]
  (let [grid (str/split-lines input)]
    (set
      (for [row (range (count grid))
            col (range (count (first grid)))
            :when (= (get-in grid [row col]) \#)]
        (take dimensions (concat [row col] (repeat 0)))))))

(defn- neighbours-for [cube]
  (for [direction (apply cartesian-product (take (count cube) (repeat [-1 0 1])))
        :when (not (every? zero? direction))]
    (map + cube direction)))

(defn- boot-cycle [active]
  (let [active-with-neighbours (set (concat active (mapcat neighbours-for active)))]
    (set
      (filter
        (fn [cube]
          (let [total-active-neighbours (count (filter active (neighbours-for cube)))]
            (or (= total-active-neighbours 3)
                (and (= total-active-neighbours 2) (active cube)))))
      active-with-neighbours))))

(defn part-1
  "Day 17 Part 1"
  [input]
  (->> (parse-pocket-dimension input 3)
       (iterate boot-cycle)
       (drop 6)
       first
       count))

(defn part-2
  "Day 17 Part 2"
  [input]
  (->> (parse-pocket-dimension input 4)
       (iterate boot-cycle)
       (drop 6)
       first
       count))
