(load-file "/src/helpers.clj")

(defn parse-numbers [filename]
  (sort (map read-string (read-lines filename))))

(def total-adapter-arrangements
  (memoize
    (fn [xs total]
      (if (empty? xs)
        1
        (reduce
          (fn [acc x] (+ acc (total-adapter-arrangements (filter #(> % x) xs) x)))
          0
          (take-while #(< (- % total) 4) xs))))))

(defn part1 [filename]
  (->> (parse-numbers filename)
       (reduce
          (fn [{:keys [acc y]} x] {:acc (update acc (- x y) inc) :y x})
          {:acc {1 0 3 1} :y 0})
       (#(apply * (vals (:acc %))))))

(defn part2 [filename]
  (total-adapter-arrangements (parse-numbers filename) 0))

(println (part1 "/src/day10/input.txt"))
(println (part2 "/src/day10/input.txt"))
