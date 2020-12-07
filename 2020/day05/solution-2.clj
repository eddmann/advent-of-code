(load-file "/src/helpers.clj")

(defn to-decimal [location]
  (->> (replace {\F 0 \B 1 \L 0 \R 1} location)
       clojure.string/join
       (#(Integer/parseInt %1 2))))

(defn calc-seat-id [location]
  (+ (* (to-decimal (take 7 location)) 8)
     (to-decimal (drop 7 location))))

(defn part1 [filename]
  (->> (read-lines filename)
       (map calc-seat-id)
       (apply max)))

(println (part1 "/src/day05/input.txt"))
