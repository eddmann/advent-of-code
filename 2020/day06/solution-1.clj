(use '[clojure.string :only (split)]
     '[clojure.set :only (intersection)])

(load-file "/src/helpers.clj")

(defn part1 [filename]
  (let [union-count #(->> (.replaceAll %1 "[^a-z]" "") set count)]
    (->> (read-line-groups filename)
         (map union-count)
         (reduce +))))

(defn part2 [filename]
  (let [intersection-count #(->> (split %1 #"\n") (map set) (apply intersection) count)]
    (->> (read-line-groups filename)
         (map intersection-count)
         (reduce +))))

(println (part1 "/src/day06/input.txt"))
(println (part2 "/src/day06/input.txt"))
