(ns aoc-2020.day-17)

(defn- cartesian-product [cols]
  (if (empty? cols)
    '(())
    (for [more (cartesian-product (rest cols)) x (first cols)] (cons x more))))

(defn- gen-plane [active-cubes]
  (cartesian-product (map (fn [col] (range (dec (apply min col)) (+ 2 (apply max col))))
                     (apply map vector active-cubes))))

(def gen-neighbours
  (memoize (fn [dimensions]
             (remove #(every? zero? %)
                     (cartesian-product (take dimensions (repeat [-1 0 1])))))))

(defn- next-cycle [dimensions curr-active next-active pos]
  (let [active-neighbours (reduce #(if (contains? curr-active (map + pos %2)) (inc %1) %1)
                                  0
                                  (gen-neighbours dimensions))]
    (cond
      (= active-neighbours 3) (conj next-active pos)
      (and (= active-neighbours 2) (contains? curr-active pos)) (conj next-active pos)
      :else next-active)))

(defn- boot-cycle [dimensions active-cubes]
  (iterate #(reduce (partial next-cycle dimensions %) #{} (gen-plane %))
           active-cubes))

(defn- parse-plane [input dimensions]
  (->> (clojure.string/split input #"\n")
       (map-indexed (fn [row line]
                      (map-indexed (fn [col val] (when (= val \#) (take dimensions (concat [row col] (repeat 0)))))
                                   (char-array line))))
       (apply concat)
       (remove nil?)
       set))

(defn part-1
  "Day 17 Part 1"
  [input]
  (->> (parse-plane input 3)
       (boot-cycle 3)
       (drop 6)
       first
       count))

(defn part-2
  "Day 17 Part 2"
  [input]
  (->> (parse-plane input 4)
       (boot-cycle 4)
       (drop 6)
       first
       count))
