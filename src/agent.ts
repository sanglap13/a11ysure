import OpenAI from "openai";
import { config } from "dotenv";
import { IAuditSummary } from "./types";

config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MODEL = process.env.MODEL_NAME || "gpt-4o-mini";

export async function auditReactCode(code: string): Promise<IAuditSummary> {
  const systemPrompt = `
You are A11yScore – an Accessibility Audit & Scoring Agent specialized in React applications.

Audit the following React code.

Categorize issues into:
- critical
- major
- minor

Return ONLY valid JSON in this exact format:

{
  "critical": number,
  "major": number,
  "minor": number
}
`;

  const response = await client.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: code },
    ],
    temperature: 0,
  });

  const content = response.choices[0].message.content;

  if (!content) {
    throw new Error("Empty response from model");
  }

  try {
    const parsed = JSON.parse(content);

    return {
      critical: parsed.critical || 0,
      major: parsed.major || 0,
      minor: parsed.minor || 0,
      computed_accessibility_score: 0, // computed later
    };
  } catch (error) {
    throw new Error("Failed to parse model response as JSON");
  }
}
