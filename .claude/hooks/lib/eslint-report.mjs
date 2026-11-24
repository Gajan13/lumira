// Turns `eslint --format json` output into short "file:line:col message (rule)" lines.
// Falls back to the raw output when ESLint crashed before printing JSON.
import { relative } from "node:path";

export function formatEslintOutput(root, stdout, stderr, max) {
  try {
    const results = JSON.parse(stdout);
    const lines = [];
    for (const result of results) {
      const file = relative(root, result.filePath).replace(/\\/g, "/");
      for (const m of result.messages) {
        const kind = m.severity === 2 ? "error" : "warning";
        const rule = m.ruleId ? ` (${m.ruleId})` : "";
        lines.push(
          `${file}:${m.line ?? 0}:${m.column ?? 0} ${kind}: ${m.message}${rule}`,
        );
      }
    }
    return lines.slice(0, max);
  } catch {
    return `${stdout}${stderr}`
      .split("\n")
      .filter((line) => line.trim())
      .slice(0, max);
  }
}
