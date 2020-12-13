(load-file "/src/helpers.clj")

(defn parse-directions [filename]
  (->> (read-lines filename)
       (map (fn [line] [(char (first line))
                        (Integer/parseInt (subs line 1) 10)]))))

(defn part1 [filename]
  (->> (parse-directions filename)
       (reduce
         (fn [[x y direction] [action value]]
           (let [action (if (= action \F)
                          (case direction 0 \E 90 \S 180 \W 270 \N)
                          action)]
             (case action
               \N [x (+ y value) direction]
               \E [(+ x value) y direction]
               \S [x (- y value) direction]
               \W [(- x value) y direction]
               \L [x y (mod (- direction value) 360)]
               \R [x y (mod (+ direction value) 360)])))
         [0 0 0])
       ((fn [[x y]] (+ (Math/abs x) (Math/abs y))))))

(defn part2 [filename]
  (letfn [(rotate-wp [x y direction]
            (if (zero? (mod direction 360))
              [x y]
              (recur (- y) x (- direction 90))))]
    (->> (parse-directions filename)
         (reduce
           (fn [[x y wp-x wp-y] [action value]]
             (case action
               \N [x y wp-x (+ wp-y value)]
               \E [x y (+ wp-x value) wp-y]
               \S [x y wp-x (- wp-y value)]
               \W [x y (- wp-x value) wp-y]
               \F [(+ x (* wp-x value)) (+ y (* wp-y value)) wp-x wp-y]
               \L (concat [x y] (rotate-wp wp-x wp-y value))
               \R (concat [x y] (rotate-wp wp-x wp-y (- value)))))
           [0 0 10 1])
         ((fn [[x y]]
           (+ (Math/abs x) (Math/abs y)))))))

(println (part1 "/src/day12/input.txt"))
(println (part2 "/src/day12/input.txt"))
