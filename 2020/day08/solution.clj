(use '[clojure.string :only (split)])

(load-file "/src/helpers.clj")

(defn parse-code [filename]
  (mapv (fn [line]
          (let [[op val] (split line #" ")]
            [(keyword op) (Integer/parseInt val)]))
        (read-lines filename)))

(defn exec [ops]
  (loop [acc 0 pos 0 seen #{}]
    (if-let [[op val] (nth ops pos nil)]
      (cond
        (some #{pos} seen) [acc false]
        (= op :acc) (recur (+ acc val) (inc pos) (conj seen pos))
        (= op :jmp) (recur acc (+ pos val) (conj seen pos))
        :else (recur acc (inc pos) (conj seen pos)))
      [acc (= pos (count ops))])))

(defn find-complete-exec [ops]
  (letfn [(replace-op [pos op] (update ops pos (fn [[_ val]] [op val])))
          (is-complete? [[_ complete]] complete)]
    (loop [pos 0]
      (if-let [[op val] (nth ops pos nil)]
        (cond
          (and (= op :jmp) (is-complete? (exec (replace-op pos :nop)))) (exec (replace-op pos :nop))
          (and (= op :nop) (is-complete? (exec (replace-op pos :jmp)))) (exec (replace-op pos :jmp))
          :else (recur (inc pos)))))))

(defn part1 [filename]
  (->> (parse-code filename)
       exec
       first))

(defn part2 [filename]
  (->> (parse-code filename)
       find-complete-exec
       first))

(println (part1 "/src/day08/input.txt"))
(println (part2 "/src/day08/input.txt"))
