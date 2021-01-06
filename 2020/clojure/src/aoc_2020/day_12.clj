(ns aoc-2020.day-12
  (:require [clojure.string :as str]))

(defn- parse-navigation-instructions [input]
  (map #(vector (first %) (read-string (subs % 1)))
       (str/split-lines input)))

(defn- manhattan-distance [x y]
  (+ (Math/abs x) (Math/abs y)))

(defn part-1
  "Day 12 Part 1"
  [input]
  (->> (parse-navigation-instructions input)
       (reduce
         (fn [[x y direction] [action value]]
           (let [action (if (= action \F)
                          (case direction 0 \E 90 \S 180 \W 270 \N)
                          action)]
             (case action
               \N [x (+ y value) direction]
               \E [(+ x value) y direction]
               \S [x (- y value) direction]
               \W [(- x value) y direction]
               \L [x y (mod (- direction value) 360)]
               \R [x y (mod (+ direction value) 360)])))
         [0 0 0])
       (take 2)
       (apply manhattan-distance)))

(defn part-2
  "Day 12 Part 2"
  [input]
  (letfn [(rotate-wp [x y direction]
            (if (zero? (mod direction 360))
              [x y]
              (recur (- y) x (- direction 90))))]
    (->> (parse-navigation-instructions input)
         (reduce
           (fn [[x y wp-x wp-y] [action value]]
             (case action
               \N [x y wp-x (+ wp-y value)]
               \E [x y (+ wp-x value) wp-y]
               \S [x y wp-x (- wp-y value)]
               \W [x y (- wp-x value) wp-y]
               \F [(+ x (* wp-x value)) (+ y (* wp-y value)) wp-x wp-y]
               \L (concat [x y] (rotate-wp wp-x wp-y value))
               \R (concat [x y] (rotate-wp wp-x wp-y (- value)))))
           [0 0 10 1])
         (take 2)
         (apply manhattan-distance))))
