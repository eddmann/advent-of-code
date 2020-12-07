(load-file "/src/helpers.clj")

(defn parse-bag [line]
  (let [[_ colour raw-contents] (re-matches #"([a-z\s]+) bags contain (.+)" line)
        contents (->> (re-seq #"([0-9]+) ([a-z\s]+) bag" raw-contents)
                      (map (fn [[_ count colour]] [colour (Integer/parseInt count)]))
                      (into {}))]
    [colour contents]))

(defn read-bags [filename]
  (into {} (map parse-bag (read-lines filename))))

(defn part1
  ([bags colour]
    (reduce + (map #(part1 bags colour %1) (keys bags))))
  ([bags colour curr-colour]
    (let [curr-bag (keys (bags curr-colour))]
      (cond
        (empty? curr-bag) 0
        (.contains curr-bag colour) 1
        :else (if (some pos? (map #(part1 bags colour %1) curr-bag)) 1 0)))))

(defn part2 [bags colour]
  (let [root (bags colour)]
    (if (empty? root)
      0
      (reduce-kv #(+ %1 %3 (* %3 (part2 bags %2))) 0 root))))

(println (part1 (read-bags "/src/day07/input.txt") "shiny gold"))
(println (part2 (read-bags "/src/day07/input.txt") "shiny gold"))
