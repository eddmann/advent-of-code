(load-file "/src/helpers.clj")

(defn parse-password [line]
  (let [matcher (re-matcher #"^(?<low>[0-9]+)-(?<high>[0-9]+)\s(?<letter>[a-z]):\s(?<password>[a-z]+)$" line)]
    (if (.matches matcher)
      {:low (Integer/parseInt (.group matcher "low"))
       :high (Integer/parseInt (.group matcher "high"))
       :letter (.charAt (.group matcher "letter") 0)
       :password (.group matcher "password")})))

(defn read-passwords [filename]
  (map parse-password (read-lines filename)))

(defn is-valid-freq? [{:keys [low high letter password]}]
  (let [letter-freq (reduce
                      (fn [count ch] (if (= letter ch) (inc count) count))
                      0
                      (char-array password))]
    (<= low letter-freq high)))

(defn is-valid-pos? [{:keys [low high letter password]}]
  (let [x (.charAt password (dec low))
        y (.charAt password (dec high))]
    (and (not= x y) (or (= x letter) (= y letter)))))

(defn part1 [filename]
  (let [passwords (read-passwords filename)]
    (reduce
      (fn [count password] (if (is-valid-freq? password) (inc count) count))
      0
      passwords)))

(defn part2 [filename]
  (let [passwords (read-passwords filename)]
    (reduce
      (fn [count password] (if (is-valid-pos? password) (inc count) count))
      0
      passwords)))

(println (part1 "/src/day02/input.txt"))
(println (part2 "/src/day02/input.txt"))
