(load-file "/src/helpers.clj")

(defn to-decimal [location]
  (->> (map-indexed #(if (.contains [\B \R] %2) (Math/pow 2 (- (count location) %1 1)) 0) location)
       (reduce +)
       int))

(defn calc-seat-id [location]
  (+ (* (to-decimal (take 7 location)) 8)
     (to-decimal (drop 7 location))))

(defn part1 [filename]
  (->> (read-lines filename)
       (map calc-seat-id)
       (apply max)))

(println (part1 "/src/day05/input.txt"))
