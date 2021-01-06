(ns aoc-2020.day-04
  (:require [clojure.string :as str]))

(defn- parse-passport [passport]
  (let [attributes (re-seq #"(\w+):([\#\w]+)" passport)]
    (into {} (map (fn [[_ k v]] [(keyword k) v]) attributes))))

(defn- parse-passports [input]
  (map parse-passport (str/split input #"\n\n")))

(defn- has-required-fields? [passport]
  (every? #(%1 passport) [:byr :iyr :eyr :hgt :hcl :ecl :pid]))

(defn- to-int [str]
  (Integer/parseInt (str/replace str #"[^0-9]+" "") 10))

(defn- has-valid-fields? [{:keys [byr iyr eyr hgt hcl ecl pid]}]
  (cond
    (not (<= 1920 (to-int byr) 2002)) false
    (not (<= 2010 (to-int iyr) 2020)) false
    (not (<= 2020 (to-int eyr) 2030)) false
    (not (or (str/ends-with? hgt "cm") (str/ends-with? hgt "in"))) false
    (and (str/ends-with? hgt "cm") (not (<= 150 (to-int hgt) 193))) false
    (and (str/ends-with? hgt "in") (not (<= 59 (to-int hgt) 76))) false
    (nil? (re-matches #"^#[a-f0-9]{6}$" hcl)) false
    (nil? (re-matches #"^amb|blu|brn|gry|grn|hzl|oth$" ecl)) false
    (nil? (re-matches #"^[0-9]{9}$" pid)) false
    :else true))

(defn part-1
  "Day 04 Part 1"
  [input]
  (->> (parse-passports input)
       (filter has-required-fields?)
       count))

(defn part-2
  "Day 04 Part 2"
  [input]
  (->> (parse-passports input)
       (filter (every-pred has-required-fields? has-valid-fields?))
       count))
