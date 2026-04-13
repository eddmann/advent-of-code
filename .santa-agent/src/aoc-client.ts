import { mkdirSync, existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import * as cheerio from "cheerio";

const BASE_URL = "https://adventofcode.com";
const CACHE_DIR = join(import.meta.dirname, "..", ".cache");
const RATE_LIMIT_MS = 1000;

let lastRequestTime = 0;

export interface PuzzleData {
  input: string;
  prose: string;
  submittedAnswers: {
    partOne: string | null;
    partTwo: string | null;
  };
}

function rateLimit(): void {
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed < RATE_LIMIT_MS) {
    Bun.sleepSync(RATE_LIMIT_MS - elapsed);
  }
  lastRequestTime = Date.now();
}

function ensureCacheDir(): void {
  if (!existsSync(CACHE_DIR)) {
    mkdirSync(CACHE_DIR, { recursive: true });
  }
}

function getCachePath(year: number, day: number, type: string): string {
  return join(CACHE_DIR, `${year}_${day}_${type}.txt`);
}

function getCached(year: number, day: number, type: string): string | null {
  try {
    return readFileSync(getCachePath(year, day, type), "utf-8");
  } catch {
    return null;
  }
}

function setCache(year: number, day: number, type: string, content: string): void {
  ensureCacheDir();
  writeFileSync(getCachePath(year, day, type), content);
}

async function fetchWithAuth(url: string, token: string): Promise<string> {
  rateLimit();

  const response = await fetch(url, {
    headers: {
      Cookie: `session=${token}`,
      "User-Agent": "github.com/eddmann/advent-of-code santa-agent",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText} for ${url}`);
  }

  return response.text();
}

export async function fetchInput(
  year: number,
  day: number,
  token: string
): Promise<string> {
  const cached = getCached(year, day, "input");
  if (cached) return cached;

  const url = `${BASE_URL}/${year}/day/${day}/input`;
  const input = await fetchWithAuth(url, token);
  setCache(year, day, "input", input);
  return input.trimEnd();
}

function parseSubmittedAnswers(html: string): {
  partOne: string | null;
  partTwo: string | null;
} {
  const $ = cheerio.load(html);
  const answers: string[] = [];

  const mainHtml = $("main").html() || "";
  const matches = mainHtml.matchAll(
    /Your puzzle answer was <code>([^<]+)<\/code>/g
  );
  for (const match of matches) {
    const answer = match[1];
    if (answer && !answers.includes(answer)) {
      answers.push(answer);
    }
  }

  return {
    partOne: answers[0] || null,
    partTwo: answers[1] || null,
  };
}

export async function fetchPuzzlePage(
  year: number,
  day: number,
  token: string
): Promise<{
  html: string;
  submittedAnswers: { partOne: string | null; partTwo: string | null };
}> {
  const cached = getCached(year, day, "page");
  let html: string;

  if (cached) {
    html = cached;
  } else {
    const url = `${BASE_URL}/${year}/day/${day}`;
    html = await fetchWithAuth(url, token);
  }

  const submittedAnswers = parseSubmittedAnswers(html);

  // Only cache if both answers are present — incomplete pages would go stale
  if (!cached && submittedAnswers.partOne && submittedAnswers.partTwo) {
    setCache(year, day, "page", html);
  }

  return { html, submittedAnswers };
}

export async function fetchPuzzleData(
  year: number,
  day: number,
  token: string
): Promise<PuzzleData> {
  // Fetch input and page in parallel (fetchPuzzleAsMarkdown calls fetchPuzzlePage internally,
  // so we call it first and extract submittedAnswers from the same fetch)
  const [input, { prose, submittedAnswers }] = await Promise.all([
    fetchInput(year, day, token),
    fetchPuzzleAsMarkdownWithAnswers(year, day, token),
  ]);

  return { input: input.trimEnd(), prose, submittedAnswers };
}

async function fetchPuzzleAsMarkdownWithAnswers(
  year: number,
  day: number,
  token: string
): Promise<{ prose: string; submittedAnswers: { partOne: string | null; partTwo: string | null } }> {
  const { html, submittedAnswers } = await fetchPuzzlePage(year, day, token);
  const $ = cheerio.load(html);

  const articles: string[] = [];
  $("article.day-desc").each((_, article) => {
    const $article = $(article);
    let md = "";

    const title = $article.find("h2").first().text();
    if (title) md += `## ${title}\n\n`;

    $article.children().each((_, el) => {
      const $el = $(el);
      const tag = (el as any).tagName?.toLowerCase() as string | undefined;

      if (tag === "h2") return;
      if (tag === "p") {
        let text = $el.html() || "";
        text = text.replace(/<code>([^<]*)<\/code>/g, "`$1`");
        text = text.replace(/<em>([^<]*)<\/em>/g, "**$1**");
        text = text.replace(/<a href="([^"]*)"[^>]*>([^<]*)<\/a>/g, "[$2]($1)");
        text = text.replace(/<[^>]+>/g, "");
        text = text.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
        md += text.trim() + "\n\n";
      } else if (tag === "pre") {
        md += "```\n" + $el.text() + "\n```\n\n";
      } else if (tag === "ul") {
        $el.find("li").each((_, li) => {
          let text = $(li).html() || "";
          text = text.replace(/<code>([^<]*)<\/code>/g, "`$1`");
          text = text.replace(/<em>([^<]*)<\/em>/g, "**$1**");
          text = text.replace(/<[^>]+>/g, "");
          md += `- ${text.trim()}\n`;
        });
        md += "\n";
      }
    });

    articles.push(md.trim());
  });

  let prose = articles.join("\n\n---\n\n");

  if (submittedAnswers.partOne || submittedAnswers.partTwo) {
    prose += "\n\n---\n\n## Your Submitted Answers\n\n";
    if (submittedAnswers.partOne) prose += `- **Part One:** \`${submittedAnswers.partOne}\`\n`;
    if (submittedAnswers.partTwo) prose += `- **Part Two:** \`${submittedAnswers.partTwo}\`\n`;
  }

  return { prose, submittedAnswers };
}
