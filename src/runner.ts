import fs from "fs";
import path from "path";
import { auditReactCode } from "./agent";
import { calculateAccessibilityScore } from "./scoring";

async function run() {
  const filePath = process.argv[2];

  if (!filePath) {
    console.error("Please provide a React file path.");
    process.exit(1);
  }

  const absolutePath = path.resolve(filePath);
  const code = fs.readFileSync(absolutePath, "utf-8");

  console.log("Running A11yScore Audit...\n");

  const result = await auditReactCode(code);

  const finalScore = calculateAccessibilityScore(
    result.critical,
    result.major,
    result.minor,
  );

  result.computed_accessibility_score = finalScore;

  console.log("=== A11yScore Result ===");
  console.log(JSON.stringify(result, null, 2));
}

run();
