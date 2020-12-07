(load-file "/src/helpers.clj")

(defn read-ints [filename]
  (map clojure.edn/read-string (read-lines filename)))

(defn part1 [filename sum]
  (let [numbers (read-ints filename)]
    (first
      (for [x numbers
            y numbers
            :when (and (not= x y) (= (+ x y) sum))]
        (* x y)))))

(defn part2 [filename sum]
  (let [numbers (read-ints filename)]
    (first
      (for [x numbers
            y numbers
            z numbers
            :when (and (not= x y z) (= (+ x y z) sum))]
        (* x y z)))))

(println (part1 "/src/day01/input.txt" 2020))
(println (part2 "/src/day01/input.txt" 2020))
