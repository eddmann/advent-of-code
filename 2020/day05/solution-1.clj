(load-file "/src/helpers.clj")

(defn calc-row
  ([location]
    (calc-row (take 7 (char-array location)) (range 0 128)))
  ([row-loc rows]
    (if (empty? row-loc)
      (first rows)
      (recur
        (rest row-loc)
        (if (= \F (first row-loc))
          (take (/ (count rows) 2) rows)
          (drop (/ (count rows) 2) rows))))))

(defn calc-col
  ([location]
    (calc-col (drop 7 (char-array location)) (range 0 8)))
  ([col-loc cols]
    (if (empty? col-loc)
      (first cols)
      (recur
        (rest col-loc)
        (if (= \L (first col-loc))
          (take (/ (count cols) 2) cols)
          (drop (/ (count cols) 2) cols))))))

(defn calc-seat-id [location]
  (+ (* (calc-row location) 8)
     (calc-col location)))

(defn part1 [filename]
  (->> (read-lines filename)
       (map calc-seat-id)
       (apply max)))

(defn part2 [filename]
  (loop [[x & ys] (->> (read-lines filename) (map calc-seat-id) sort)]
    (cond
      (nil? x) nil
      (empty? ys) nil
      (= 1 (- (first ys) x)) (recur ys)
      :else (inc x))))

(println (part1 "/src/day05/input.txt"))
(println (part2 "/src/day05/input.txt"))
