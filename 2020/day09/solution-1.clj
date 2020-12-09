(load-file "/src/helpers.clj")

(defn parse-numbers [filename]
  (mapv read-string (read-lines filename)))

(defn combinations [col]
  (for [x col y col] [x y]))

(defn first-incorrect-sum [_ col]
  (let [sum (last col)
        seq (butlast col)]
    (when (not (some #(= sum (apply + %)) (combinations seq)))
      (reduced sum))))

(defn part1 [filename seq-size]
  (->> (parse-numbers filename)
       (partition (inc seq-size) 1)
       (reduce first-incorrect-sum nil)))

(defn part2 [filename sum]
  (let [seq (parse-numbers filename)]
    (loop [start 0
           end 1
           acc (apply + (take 2 seq))]
      (cond
        (= end (count seq)) nil
        (> acc sum) (recur (inc start) end (- acc (nth seq start)))
        (< acc sum) (recur start (inc end) (+ acc (nth seq (inc end) 0)))
        :else (let [subseq (subvec seq start end)]
          (+ (apply min subseq) (apply max subseq)))))))

(println (part1 "/src/day09/input.txt" 25))
(println (part2 "/src/day09/input.txt" 133015568))
