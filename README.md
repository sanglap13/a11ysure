# A11yScore – Accessibility Audit & Scoring Agent for React

A11yScore is a Cursor-configured AI Agent designed to audit React applications for accessibility issues and generate a structured, weighted accessibility score out of 10,000.

It applies a deterministic penalty-based scoring model inspired by WCAG principles and produces consistent, measurable accessibility evaluations.

---

## Problem Specialization

Modern React applications frequently fail basic accessibility standards:

- Missing `alt` attributes
- Clickable `div` instead of `button`
- Missing form labels
- Improper heading hierarchy
- Poor semantic HTML
- Missing ARIA attributes

While default LLM assistants provide general suggestions, they do not:

- Apply structured categorization
- Provide weighted scoring
- Offer deterministic penalty models
- Generate consistent JSON summaries

A11yScore addresses this gap by introducing:

- Strict accessibility auditing rules
- Categorized violation detection
- A reproducible 10,000-point scoring system
- Structured benchmarking capability

---

## Agent Architecture

A11yScore consists of:

- `.cursorrules` → Defines agent specialization inside Cursor
- `agent.ts` → LLM-powered accessibility auditor
- `scoring.ts` → Deterministic penalty model
- `runner.ts` → CLI execution layer
- `examples/` → Test React applications
- `benchmark/` → Claude comparison results

---

## Cursor Configuration

The `.cursorrules` file configures Cursor to treat the repository as an accessibility auditing environment.

The agent enforces:

CRITICAL:

- Missing alt attributes
- Missing form labels
- Clickable div misuse
- Heading hierarchy violations
- Keyboard inaccessibility

MAJOR:

- Missing button type
- Missing ARIA attributes
- Poor semantic structure
- Focus management issues

MINOR:

- Non-descriptive links
- Redundant ARIA
- Decorative alt misuse

The agent always outputs structured JSON:

```json
{
  "critical": number,
  "major": number,
  "minor": number,
  "computed_accessibility_score": number
}
```

---

## Installation & Setup

- **Install dependencies**:

```bash
npm install
```

- **Configure environment**:
  - Create a `.env` file based on `.env.example`.
  - Set `OPENAI_API_KEY` to a valid OpenAI API key.
  - Optionally override `MODEL_NAME` (defaults to `gpt-4o-mini`).

---

## Running A11yScore

- **Build the project**:

```bash
npm run build
```

- **Run an accessibility audit on a React file**:

```bash
node dist/runner.js examples/bad-app/App.tsx
```

This prints a structured JSON summary with `critical`, `major`, `minor`, and `computed_accessibility_score` fields.

---

## Benchmark & Examples

- **Benchmark comparison**: See `benchmark/comparison.md` for a side-by-side comparison with a default Cursor Claude assistant.
- **Example apps**: The `examples/` directory contains `bad-app`, `medium-app`, and `good-app` React apps used in the benchmark.
