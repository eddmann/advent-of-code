(require '[clojure.string :as s])

(load-file "/src/helpers.clj")

(defn parse-passport [passport]
  (let [attributes (re-seq #"(\w+):([\#\w]+)" passport)]
    (into {} (map (fn [[_ k v]] [(keyword k) v]) attributes))))

(defn read-passports [filename]
  (map parse-passport (read-line-groups filename)))

(defn has-required-fields? [passport]
  (every? #(%1 passport) [:byr :iyr :eyr :hgt :hcl :ecl :pid]))

(defn to-int [str]
  (Integer/parseInt (s/replace str #"[^0-9]+" "") 10))

(defn has-valid-fields? [{:keys [byr iyr eyr hgt hcl ecl pid]}]
  (cond
    (not (<= 1920 (to-int byr) 2002)) false
    (not (<= 2010 (to-int iyr) 2020)) false
    (not (<= 2020 (to-int eyr) 2030)) false
    (not (or (s/ends-with? hgt "cm") (s/ends-with? hgt "in"))) false
    (and (s/ends-with? hgt "cm") (not (<= 150 (to-int hgt) 193))) false
    (and (s/ends-with? hgt "in") (not (<= 59 (to-int hgt) 76))) false
    (nil? (re-matches #"^#[a-f0-9]{6}$" hcl)) false
    (nil? (re-matches #"^amb|blu|brn|gry|grn|hzl|oth$" ecl)) false
    (nil? (re-matches #"^[0-9]{9}$" pid)) false
    :else true))

(defn part1 [filename]
  (->> (read-passports filename)
       (filter has-required-fields?)
       count))

(defn part2 [filename]
  (->> (read-passports filename)
       (filter #(and (has-required-fields? %1) (has-valid-fields? %1)))
       count))

(println (part1 "/src/day04/input.txt"))
(println (part2 "/src/day04/input.txt"))
