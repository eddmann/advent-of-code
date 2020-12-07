(use '[clojure.string :only (split)]
     '[clojure.set :only (union intersection)])

(load-file "/src/helpers.clj")

(defn read-answers [filename]
  (map #(map set (split %1 #"\n"))
       (read-line-groups filename)))

(defn part1 [filename]
  (->> (read-answers filename)
       (reduce #(+ %1 (count (apply union %2))) 0)))

(defn part2 [filename]
  (->> (read-answers filename)
       (reduce #(+ %1 (count (apply intersection %2))) 0)))

(println (part1 "/src/day06/input.txt"))
(println (part2 "/src/day06/input.txt"))
