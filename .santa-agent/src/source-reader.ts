import { readFileSync } from "fs";

export interface SourceSolution {
  code: string;
  language: string;
}

export function readSourceSolutions(
  sourceFiles: string[],
  testFiles: string[]
): SourceSolution {
  const codeBlocks: string[] = [];
  let language = "unknown";

  for (const file of sourceFiles) {
    const content = readFileSync(file, "utf-8");
    const ext = file.split(".").pop() || "";
    language = extToLanguage(ext);
    codeBlocks.push(`// --- ${file.split("/").slice(-2).join("/")} ---\n${content}`);
  }

  for (const file of testFiles) {
    const content = readFileSync(file, "utf-8");
    codeBlocks.push(`// --- ${file.split("/").slice(-2).join("/")} (test) ---\n${content}`);
  }

  return {
    code: codeBlocks.join("\n\n"),
    language,
  };
}

function extToLanguage(ext: string): string {
  const map: Record<string, string> = {
    ts: "TypeScript",
    js: "JavaScript",
    py: "Python",
    rs: "Rust",
    kt: "Kotlin",
    swift: "Swift",
    clj: "Clojure",
    c: "C",
    ex: "Elixir",
  };
  return map[ext] || ext;
}

