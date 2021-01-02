(ns aoc-2020.day-03)

(defn- parse-map [input]
  (clojure.string/split input #"\n"))

(defn- trees [map down right]
  (let [map-width (count (first map))]
    (loop [remaining-map (drop down map)
           curr-pos right
           count 0]
      (if (empty? remaining-map)
        count
        (recur
          (drop down remaining-map)
          (mod (+ curr-pos right) map-width)
          (if (= \# (.charAt (first remaining-map) curr-pos)) (inc count) count))))))

(defn part-1
  "Day 03 Part 1"
  [input]
  (trees (parse-map input) 1 3))

(defn part-2
  "Day 03 Part 2"
  [input]
  (let [map (parse-map input)]
    (* (trees map 1 1)
       (trees map 1 3)
       (trees map 1 5)
       (trees map 1 7)
       (trees map 2 1))))
