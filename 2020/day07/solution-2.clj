(load-file "/src/helpers.clj")

(defn parse-bag [line]
  (let [[_ colour raw-contents] (re-matches #"([a-z\s]+) bags contain (.+)" line)
        contents (->> (re-seq #"([0-9]+) ([a-z\s]+) bag" raw-contents)
                      (map (fn [[_ count colour]] [colour (Integer/parseInt count)]))
                      (into {}))]
    [colour contents]))

(defn read-bags [filename]
  (into {} (map parse-bag (read-lines filename))))

(defn in-bag? [bags colour curr-colour]
  (let [curr-bag (keys (bags curr-colour))]
    (or (some #(= %1 colour) curr-bag)
        (some true? (map #(in-bag? bags colour %1) curr-bag)))))

(defn part1 [bags colour]
  (reduce
    #(if (in-bag? bags colour %2) (inc %1) %1)
    0
    (keys bags)))

(println (part1 (read-bags "/src/day07/input.txt") "shiny gold"))
