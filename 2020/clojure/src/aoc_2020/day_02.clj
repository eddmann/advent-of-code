(ns aoc-2020.day-02)

(defn- parse-password [line]
  (let [matcher (re-matcher #"^(?<low>[0-9]+)-(?<high>[0-9]+)\s(?<letter>[a-z]):\s(?<password>[a-z]+)$" line)]
    (if (.matches matcher)
      {:low (Integer/parseInt (.group matcher "low"))
       :high (Integer/parseInt (.group matcher "high"))
       :letter (.charAt (.group matcher "letter") 0)
       :password (.group matcher "password")})))

(defn- parse-password-list [input]
  (map parse-password (clojure.string/split input #"\n")))

(defn- is-valid-freq? [{:keys [low high letter password]}]
  (let [letter-freq (reduce
                      (fn [count ch] (if (= letter ch) (inc count) count))
                      0
                      (char-array password))]
    (<= low letter-freq high)))

(defn- is-valid-pos? [{:keys [low high letter password]}]
  (let [x (.charAt password (dec low))
        y (.charAt password (dec high))]
    (and (not= x y) (or (= x letter) (= y letter)))))

(defn part-1
  "Day 02 Part 1"
  [input]
  (reduce
    (fn [count password] (if (is-valid-freq? password) (inc count) count))
    0
    (parse-password-list input)))

(defn part-2
  "Day 02 Part 2"
  [input]
  (reduce
    (fn [count password] (if (is-valid-pos? password) (inc count) count))
    0
    (parse-password-list input)))
