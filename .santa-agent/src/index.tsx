import React from "react";
import { render } from "ink";
import { parseArgs } from "util";
import { App } from "./components/App.tsx";

const { values } = parseArgs({
  args: Bun.argv.slice(2),
  options: {
    year: { type: "string", short: "y" },
    day: { type: "string", short: "d" },
    concurrency: { type: "string", short: "c" },
    "dry-run": { type: "boolean", default: false },
    help: { type: "boolean", short: "h", default: false },
  },
  strict: true,
  allowPositionals: false,
});

if (values.help) {
  console.log(`
santa-agent

Usage: bun run src/index.tsx [options]

Options:
  -y, --year <year>    Process only this year
  -d, --day <day>      Process only this day (requires --year)
  -c, --concurrency N  Run N tasks in parallel (default: 3)
  --dry-run            Show what would be processed without running agents
  -h, --help           Show this help

Environment:
  AOC_SESSION          AoC session cookie (required for fetching puzzles)

Examples:
  bun run src/index.tsx --dry-run                    # Preview all tasks
  bun run src/index.tsx --year 2015 --day 1          # Generate one solution
  bun run src/index.tsx --year 2015 -c 5             # Generate all 2015, 5 at a time
  bun run src/index.tsx                              # Generate everything
`);
  process.exit(0);
}

const year = values.year ? parseInt(values.year) : undefined;
const day = values.day ? parseInt(values.day) : undefined;
const concurrency = values.concurrency ? parseInt(values.concurrency) : 3;

if (day && !year) {
  console.error("Error: --day requires --year");
  process.exit(1);
}

render(
  <App
    year={year}
    day={day}
    concurrency={concurrency}
    dryRun={values["dry-run"]}
  />
);
