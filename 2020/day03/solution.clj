(load-file "/src/helpers.clj")

(defn trees [map down right]
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

(defn part1 [filename]
  (trees (read-lines filename) 1 3))

(defn part2 [filename]
  (let [map (read-lines filename)]
    (* (trees map 1 1)
       (trees map 1 3)
       (trees map 1 5)
       (trees map 1 7)
       (trees map 2 1))))

(println (part1 "/src/day03/input.txt"))
(println (part2 "/src/day03/input.txt"))
