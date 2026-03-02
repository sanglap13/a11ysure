## Problem Specialization

A11yScore is specialized to audit **React/JSX code for accessibility (a11y) issues** and turn those findings into a **deterministic 10,000‑point accessibility score**.

### What problem this agent solves

- **Unstructured, ad-hoc a11y reviews**  
  Most day-to-day accessibility reviews in React projects are done informally: a quick scan in the browser devtools, a pass with an automated checker, or an LLM prompt like “Is this accessible?”. The output is usually prose that is:
  - Hard to compare across runs.
  - Hard to regress-test.
  - Hard to plug into CI or dashboards.

- **Common React a11y pitfalls**  
  React apps repeatedly ship with the same classes of problems:
  - Missing `alt` attributes on `img`.
  - Clickable `div`/`span` elements used as buttons or links.
  - Inputs without associated `label`.
  - Broken or skipped heading levels (`h1` → `h3`).
  - Missing or misused ARIA attributes.

- **Lack of a stable, numeric a11y signal**  
  Teams rarely have a simple, numeric answer to “How accessible is this component/file?” that:
  - Is stable between runs.
  - Has an explicit penalty model.
  - Can be tracked over time (e.g. in CI or dashboards).

A11yScore addresses these pain points by:

- Inspecting React/JSX source for accessibility violations.
- Aggregating findings into severity buckets (`critical`, `major`, `minor`).
- Converting those counts into a **repeatable 0–10,000 accessibility score**.

### Why I chose this problem

- **High impact for real products**  
  Accessibility has concrete impact on real users (screen reader users, keyboard users, low-vision users) and also legal/compliance implications. Catching and quantifying React a11y issues early is both a user‑experience win and a risk‑reduction win.

- **Naturally suited to a specialized agent**  
  React accessibility has:
  - A well-defined set of common patterns and violations.
  - Clear ties to WCAG-style guidance.
  - Enough structure that an agent can be **trained to be strict and opinionated**, rather than generic.

- **Clear differentiation from a generic LLM**  
  A generic assistant can already “talk about” accessibility. The real value here is:
  - A **fixed JSON schema** for results.
  - A **deterministic scoring function**.
  - A bias toward **strict, systematic detection** of a small set of high-value issues.

### Why this was my #1 priority

- It demonstrates how to turn **raw LLM capabilities** into a **tool-like, measurable system**:
  - The model is constrained to JSON.
  - Scoring is handled by a separate, pure function.
  - The output is ready for automation (CI, scripts, dashboards).
- It aligns with the founder’s thesis that **AI-native workflows** will replace ad-hoc, manual checks:
  - Instead of “ask an LLM for advice”, A11yScore becomes a **repeatable part of the development pipeline**.
  - The 10,000‑point metric can evolve into a broader “code quality” or “compliance” signal.

---

## Agent Capabilities

- **React/JSX accessibility auditing**
  - Detects missing `alt` attributes on images.
  - Flags clickable `div`/`span` elements used as interactive controls.
  - Identifies inputs without labels or mis-wired labels.
  - Checks for heading hierarchy violations.
  - Surfaces missing or misused ARIA attributes where applicable.

- **Severity-based aggregation**
  - Aggregates issues into:
    - `critical` (blocking or severe a11y failures).
    - `major` (important but non-blocking issues).
    - `minor` (usability or polish-level concerns).

- **Deterministic scoring**
  - Uses a fixed 10,000‑point model with explicit penalties per issue class.
  - Ensures that identical inputs produce identical scores.

- **Machine-readable, minimal output**
  - Returns a compact JSON object:
    - `critical`: number
    - `major`: number
    - `minor`: number
    - `computed_accessibility_score`: number
  - This is easy to parse in CI, scripts, or analytics pipelines.

- **Cursor-integrated specialization**
  - `.cursorrules` keeps Cursor focused on these accessibility concerns when working in this repo.

---

## Design Decisions

### 1. Separation of concerns

- `agent.ts` is responsible for:
  - Talking to the model.
  - Constraining output to the JSON schema.
  - Producing `critical`, `major`, and `minor` counts.

- `scoring.ts` is responsible for:
  - Mapping those counts to a 10,000‑point score via a pure function.
  - Remaining transparent and easily tunable (penalties can be adjusted without touching the model logic).

This separation makes the system easier to reason about and safer to evolve: changing the scoring model does not require any change to prompt or agent wiring.

### 2. Determinism as a first-class goal

- The model is called with:
  - `temperature: 0` to minimize randomness.
  - A strict system prompt that requires **JSON-only** output.
- The scoring function is:
  - Pure and stateless.
  - Fully specified in `scoring.ts`.

Together, these choices ensure:

- Same input code → same JSON counts → same final score.

### 3. Simple, explainable scoring model

- The scoring model uses a linear penalty table (e.g. 400/200/100 for critical/major/minor).
- This makes it:
  - Easy to explain to reviewers.
  - Easy to interpret at a glance (e.g. “Two criticals and three majors will roughly cost this many points.”).
  - Easy to adjust in future without touching the rest of the system.

### 4. CLI-first interface

- The primary entrypoint is a CLI:
  - `node dist/runner.js <path-to-react-file>`
- This design:
  - Keeps the integration surface small and predictable.
  - Makes it trivial to:
    - Run local experiments.
    - Wire the agent into CI.
    - Benchmark multiple example apps, as shown in `benchmark/comparison.md`.
