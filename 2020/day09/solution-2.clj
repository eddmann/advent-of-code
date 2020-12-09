(load-file "/src/helpers.clj")

(defn parse-numbers [filename]
  (map read-string (read-lines filename)))

(defn part2 [filename sum]
  (let [seq (parse-numbers filename)]
    (reduce
      #(when (= sum (apply + %2)) (reduced (+ (apply min %2) (apply max %2))))
      nil
      (mapcat #(partition % 1 seq) (range 2 (count seq))))))

(println (part2 "/src/day09/input.txt" 133015568))
