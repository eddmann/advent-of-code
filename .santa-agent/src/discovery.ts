import { existsSync, readdirSync } from "fs";
import { join } from "path";

export interface SolutionTask {
  year: number;
  day: number;
  targetPath: string;
  sourceFiles: string[];
  testFiles: string[];
  status: "pending" | "running" | "pass" | "fail" | "skip";
}

interface YearConfig {
  languages: {
    dir: string;
    solutionPattern: (day: number) => string[];
    testPattern?: (day: number) => string[];
  }[];
}

const ROOT = join(import.meta.dirname, "..", "..");

const YEAR_CONFIGS: Record<number, YearConfig> = {
  2015: {
    languages: [
      {
        dir: "typescript/src",
        solutionPattern: (d) => {
          const dd = String(d).padStart(2, "0");
          return [`day${dd}/solution-1.ts`, `day${dd}/solution-2.ts`];
        },
        testPattern: (d) => {
          const dd = String(d).padStart(2, "0");
          return [
            `day${dd}/solution-1.test.ts`,
            `day${dd}/solution-2.test.ts`,
          ];
        },
      },
    ],
  },
  2016: {
    languages: [
      {
        dir: "python/src",
        solutionPattern: (d) => {
          const dd = String(d).padStart(2, "0");
          return [`day${dd}/solution-1.py`, `day${dd}/solution-2.py`];
        },
      },
    ],
  },
  2017: {
    languages: [
      {
        dir: "rust",
        solutionPattern: (d) => {
          const dd = String(d).padStart(2, "0");
          return [
            `day${dd}/src/main.rs`,
            `day${dd}/src/bin/sol1.rs`,
            `day${dd}/src/bin/sol2.rs`,
          ];
        },
      },
    ],
  },
  2018: {
    languages: [
      {
        dir: "swift",
        solutionPattern: (d) => {
          const dd = String(d).padStart(2, "0");
          return [`day${dd}/Sources/Solution/Solution.swift`];
        },
      },
      {
        dir: "kotlin/src/main/kotlin",
        solutionPattern: (d) => {
          const dd = String(d).padStart(2, "0");
          return [`Day${dd}.kt`];
        },
      },
    ],
  },
  2020: {
    languages: [
      {
        dir: "typescript/src",
        solutionPattern: (d) => {
          const dd = String(d).padStart(2, "0");
          return [`day${dd}/solution-1.ts`];
        },
        testPattern: (d) => {
          const dd = String(d).padStart(2, "0");
          return [`day${dd}/solution-1.test.ts`];
        },
      },
      {
        dir: "clojure/src/aoc_2020",
        solutionPattern: (d) => {
          const dd = String(d).padStart(2, "0");
          return [`day_${dd}.clj`];
        },
      },
    ],
  },
  2021: {
    languages: [
      {
        dir: "python/src",
        solutionPattern: (d) => {
          const dd = String(d).padStart(2, "0");
          return [`day${dd}/solution-1.py`];
        },
      },
      {
        dir: "c",
        solutionPattern: (d) => {
          const dd = String(d).padStart(2, "0");
          return [`day${dd}/solution.c`];
        },
      },
    ],
  },
  2023: {
    languages: [
      {
        dir: "kotlin/src",
        solutionPattern: (d) => {
          const dd = String(d).padStart(2, "0");
          return [`Day${dd}.kt`];
        },
      },
      {
        dir: "swift/AdventOfCode2023/Sources",
        solutionPattern: (d) => {
          const dd = String(d).padStart(2, "0");
          return [`Day${dd}.swift`];
        },
      },
    ],
  },
  2024: {
    languages: [
      {
        dir: "elixir/lib",
        solutionPattern: (d) => {
          const dd = String(d).padStart(2, "0");
          return [`day${dd}.ex`];
        },
      },
    ],
  },
};

function findSourceFiles(
  year: number,
  day: number
): { sourceFiles: string[]; testFiles: string[] } {
  const config = YEAR_CONFIGS[year];
  if (!config) return { sourceFiles: [], testFiles: [] };

  const sourceFiles: string[] = [];
  const testFiles: string[] = [];

  for (const lang of config.languages) {
    const baseDir = join(ROOT, String(year), lang.dir);
    for (const pattern of lang.solutionPattern(day)) {
      const fullPath = join(baseDir, pattern);
      if (existsSync(fullPath)) {
        sourceFiles.push(fullPath);
      }
    }
    if (lang.testPattern) {
      for (const pattern of lang.testPattern(day)) {
        const fullPath = join(baseDir, pattern);
        if (existsSync(fullPath)) {
          testFiles.push(fullPath);
        }
      }
    }
  }

  return { sourceFiles, testFiles };
}

export function discoverTasks(
  filterYear?: number,
  filterDay?: number
): SolutionTask[] {
  const tasks: SolutionTask[] = [];
  const years = filterYear
    ? [filterYear]
    : Object.keys(YEAR_CONFIGS).map(Number);

  for (const year of years) {
    const days = filterDay ? [filterDay] : Array.from({ length: 25 }, (_, i) => i + 1);

    for (const day of days) {
      const dd = String(day).padStart(2, "0");
      const targetPath = join(
        ROOT,
        String(year),
        "santa-lang",
        `aoc${year}_day${dd}.santa`
      );

      // Skip if santa-lang solution already exists
      if (existsSync(targetPath)) continue;

      const { sourceFiles, testFiles } = findSourceFiles(year, day);

      // Skip if no source solutions exist
      if (sourceFiles.length === 0) continue;

      tasks.push({
        year,
        day,
        targetPath,
        sourceFiles,
        testFiles,
        status: "pending",
      });
    }
  }

  return tasks;
}

export function getExistingSantaSolutions(): { year: number; day: number }[] {
  const solutions: { year: number; day: number }[] = [];

  for (const yearStr of readdirSync(ROOT)) {
    const year = parseInt(yearStr);
    if (isNaN(year) || year < 2015 || year > 2030) continue;

    const santaDir = join(ROOT, yearStr, "santa-lang");
    if (!existsSync(santaDir)) continue;

    for (const file of readdirSync(santaDir)) {
      const match = file.match(/^aoc\d{4}_day(\d{2})\.santa$/);
      if (match?.[1]) {
        solutions.push({ year, day: parseInt(match[1]) });
      }
    }
  }

  return solutions;
}
