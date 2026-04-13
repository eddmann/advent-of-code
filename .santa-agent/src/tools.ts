import { tool, createSdkMcpServer } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";
import { execSync } from "child_process";
import { join } from "path";
import { existsSync, chmodSync } from "fs";
import { fetchPuzzlePage } from "./aoc-client.ts";

const ROOT = join(import.meta.dirname, "..", "..");
const AGENT_DIR = join(import.meta.dirname, "..");
const SANTA_CLI = join(AGENT_DIR, "santa-cli");
const SANTA_TINSEL = join(AGENT_DIR, "santa-tinsel");

const COMET_REPO = "eddmann/santa-lang-comet";
const TINSEL_REPO = "eddmann/santa-lang-tinsel";
const PLATFORM = process.arch === "arm64" ? "macos-arm64" : "macos-amd64";

const DEFAULT_TIMEOUT_MS = 120_000;
const SLOW_TIMEOUT_MS = 300_000;

function getTimeoutMs(): number {
  const env = process.env.SANTA_TIMEOUT_MS;
  return env ? parseInt(env, 10) : DEFAULT_TIMEOUT_MS;
}

function getSlowTimeoutMs(): number {
  const env = process.env.SANTA_SLOW_TIMEOUT_MS;
  return env ? parseInt(env, 10) : SLOW_TIMEOUT_MS;
}

export async function ensureSantaCli(): Promise<void> {
  if (existsSync(SANTA_CLI)) return;

  console.log("Downloading latest santa-cli (comet)...");

  const res = await fetch(`https://api.github.com/repos/${COMET_REPO}/releases/latest`);
  const release = (await res.json()) as { tag_name: string; assets: { name: string; browser_download_url: string }[] };
  const version = release.tag_name;

  const assetName = `santa-lang-comet-cli-${version}-${PLATFORM}`;
  const asset = release.assets.find((a) => a.name === assetName);
  if (!asset) {
    throw new Error(`No asset found for ${assetName} in release ${version}`);
  }

  const download = await fetch(asset.browser_download_url);
  if (!download.ok) throw new Error(`Download failed: ${download.status}`);

  await Bun.write(SANTA_CLI, download);
  chmodSync(SANTA_CLI, 0o755);

  try {
    execSync(`xattr -d com.apple.quarantine ${SANTA_CLI}`, { stdio: "ignore" });
  } catch {}

  console.log(`Downloaded santa-cli comet ${version}`);
}

export async function ensureTinsel(): Promise<void> {
  if (existsSync(SANTA_TINSEL)) return;

  console.log("Downloading latest santa-tinsel...");

  const res = await fetch(`https://api.github.com/repos/${TINSEL_REPO}/releases/latest`);
  const release = (await res.json()) as { tag_name: string; assets: { name: string; browser_download_url: string }[] };
  const version = release.tag_name;

  const assetName = `santa-tinsel-${version}-${PLATFORM}`;
  const asset = release.assets.find((a) => a.name === assetName);
  if (!asset) {
    throw new Error(`No asset found for ${assetName} in release ${version}`);
  }

  const download = await fetch(asset.browser_download_url);
  if (!download.ok) throw new Error(`Download failed: ${download.status}`);

  await Bun.write(SANTA_TINSEL, download);
  chmodSync(SANTA_TINSEL, 0o755);

  try {
    execSync(`xattr -d com.apple.quarantine ${SANTA_TINSEL}`, { stdio: "ignore" });
  } catch {}

  console.log(`Downloaded santa-tinsel ${version}`);
}

interface SolutionResult {
  type: "solution";
  status: string;
  part_one?: { status: string; value: string; duration_ms: number };
  part_two?: { status: string; value: string; duration_ms: number };
  console: string[];
}

interface TestResult {
  type: "test";
  status: string;
  success: boolean;
  summary: { total: number; passed: number; failed: number; skipped: number };
  tests: {
    index: number;
    slow: boolean;
    status: string;
    part_one?: { passed: boolean; expected: string; actual: string };
    part_two?: { passed: boolean; expected: string; actual: string };
  }[];
  console: string[];
}

function runSantaCli(args: string[], timeoutMs?: number): { stdout: string; stderr: string; exitCode: number } {
  const timeout = timeoutMs ?? getTimeoutMs();
  try {
    const stdout = execSync(`${SANTA_CLI} ${args.join(" ")}`, {
      encoding: "utf-8",
      timeout,
      cwd: ROOT,
      env: {
        ...process.env,
        ...(process.env.AOC_SESSION ? { SANTA_CLI_SESSION_TOKEN: process.env.AOC_SESSION } : {}),
      },
    });
    return { stdout, stderr: "", exitCode: 0 };
  } catch (error: any) {
    if (error.killed) {
      return { stdout: "", stderr: `Timed out after ${timeout}ms`, exitCode: 124 };
    }
    return {
      stdout: error.stdout || "",
      stderr: error.stderr || error.message || "",
      exitCode: error.status || 1,
    };
  }
}


function formatTestSummary(data: TestResult): string {
  const lines: string[] = [];
  lines.push(`Tests ${data.success ? "PASSED" : "FAILED"} — ${data.summary.passed}/${data.summary.total} passed`);

  for (const test of data.tests) {
    lines.push(`\nTestcase #${test.index}${test.slow ? " (@slow)" : ""}:`);
    if (test.part_one) {
      const icon = test.part_one.passed ? "✓" : "✗";
      lines.push(`  Part 1: ${test.part_one.actual} ${icon}${!test.part_one.passed ? ` (expected ${test.part_one.expected})` : ""}`);
    }
    if (test.part_two) {
      const icon = test.part_two.passed ? "✓" : "✗";
      lines.push(`  Part 2: ${test.part_two.actual} ${icon}${!test.part_two.passed ? ` (expected ${test.part_two.expected})` : ""}`);
    }
  }

  if (data.console.length > 0) {
    lines.push(`\nConsole output:\n${data.console.join("\n")}`);
  }

  return lines.join("\n");
}

function formatRunSummary(data: SolutionResult): string {
  const lines: string[] = [];
  if (data.part_one) {
    lines.push(`Part 1: ${data.part_one.value} (${data.part_one.duration_ms}ms)`);
  }
  if (data.part_two) {
    lines.push(`Part 2: ${data.part_two.value} (${data.part_two.duration_ms}ms)`);
  }
  if (data.console.length > 0) {
    lines.push(`\nConsole output:\n${data.console.join("\n")}`);
  }
  return lines.join("\n");
}

export function formatSantaFile(file: string): { ok: boolean; error?: string } {
  try {
    execSync(`${SANTA_TINSEL} -w ${file}`, { encoding: "utf-8", cwd: ROOT });
    return { ok: true };
  } catch (error: any) {
    return { ok: false, error: error.stderr || error.stdout || error.message };
  }
}

export function createSantaServer(aocToken?: string) {
  return createSdkMcpServer({
    name: "santa",
    version: "1.0.0",
    tools: [
      tool(
        "test",
        "Run test blocks in a .santa file. Returns structured pass/fail per test case with expected vs actual values. Skips @slow tests by default for fast iteration.",
        {
          file: z.string().describe("Absolute path to the .santa file"),
          include_slow: z.boolean().optional().describe("Include @slow-marked tests (default: false)"),
        },
        async (args) => {
          const cliArgs = ["-o", "json", "-t", ...(args.include_slow ? ["-s"] : []), args.file];
          const timeout = args.include_slow ? getSlowTimeoutMs() : getTimeoutMs();
          const result = runSantaCli(cliArgs, timeout);

          if (!result.stdout) {
            return {
              content: [{ type: "text" as const, text: `Test execution error:\n${result.stderr || "No output"}` }],
              isError: true,
            };
          }

          let data: TestResult;
          try {
            const parsed = JSON.parse(result.stdout);
            if (parsed.type === "error") {
              return {
                content: [{ type: "text" as const, text: `Syntax error: ${parsed.message}${parsed.location ? ` at line ${parsed.location.line}:${parsed.location.column}` : ""}` }],
                isError: true,
              };
            }
            data = parsed as TestResult;
          } catch {
            return {
              content: [{ type: "text" as const, text: `Failed to parse output: ${result.stdout}` }],
              isError: true,
            };
          }

          return {
            content: [{ type: "text" as const, text: formatTestSummary(data) }],
            isError: !data.success,
          };
        }
      ),

      tool(
        "verify",
        "Run a solution, return part_one/part_two values with timing, and compare against submitted AoC answers.",
        {
          file: z.string().describe("Absolute path to the .santa file"),
          year: z.number().describe("Puzzle year"),
          day: z.number().describe("Puzzle day"),
        },
        async (args) => {
          if (!aocToken) {
            return {
              content: [{ type: "text" as const, text: "Cannot verify: AOC_SESSION environment variable not set" }],
              isError: true,
            };
          }

          const result = runSantaCli(["-o", "json", args.file]);

          if (result.exitCode !== 0 || !result.stdout) {
            return {
              content: [{ type: "text" as const, text: `Solution failed to run:\n${result.stderr || result.stdout || "No output"}` }],
              isError: true,
            };
          }

          let data: SolutionResult;
          try {
            const parsed = JSON.parse(result.stdout);
            if (parsed.type === "error") {
              return {
                content: [{ type: "text" as const, text: `Solution error: ${parsed.message}${parsed.location ? ` at line ${parsed.location.line}:${parsed.location.column}` : ""}` }],
                isError: true,
              };
            }
            data = parsed as SolutionResult;
          } catch {
            return {
              content: [{ type: "text" as const, text: `Failed to parse output: ${result.stdout}` }],
              isError: true,
            };
          }

          const output = formatRunSummary(data);
          const { submittedAnswers } = await fetchPuzzlePage(args.year, args.day, aocToken);

          const mismatches: string[] = [];
          const matches: string[] = [];

          if (submittedAnswers.partOne) {
            if (data.part_one?.value === submittedAnswers.partOne) {
              matches.push(`Part 1: ${data.part_one.value} ✓`);
            } else {
              mismatches.push(`Part 1: got ${data.part_one?.value || "N/A"}, expected ${submittedAnswers.partOne}`);
            }
          }

          if (submittedAnswers.partTwo) {
            if (data.part_two?.value === submittedAnswers.partTwo) {
              matches.push(`Part 2: ${data.part_two.value} ✓`);
            } else {
              mismatches.push(`Part 2: got ${data.part_two?.value || "N/A"}, expected ${submittedAnswers.partTwo}`);
            }
          }

          const allMatch = mismatches.length === 0;
          return {
            content: [{
              type: "text" as const,
              text: `${output}\n\nVerification ${allMatch ? "PASSED" : "FAILED"}\n\n${matches.join("\n")}${mismatches.length > 0 ? `\n\nMismatches:\n${mismatches.join("\n")}` : ""}`,
            }],
            isError: !allMatch,
          };
        }
      ),

    ],
  });
}
