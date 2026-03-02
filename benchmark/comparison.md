## A11yScore vs Default Cursor (Claude) Benchmark

This benchmark compares the specialized `A11yScore` agent against a generic default Cursor (Claude) assistant on three React example apps:

- `examples/bad-app/App.tsx`
- `examples/medium-app/App.tsx`
- `examples/good-app/App.tsx`

All A11yScore results below are computed using the deterministic scoring model from `scoring.ts`:

- **Base score**: 10,000
- **Penalty per critical issue**: 400
- **Penalty per major issue**: 200
- **Penalty per minor issue**: 100
- **Final score**: `max(0, 10000 - (critical*400 + major*200 + minor*100))`

---

## Quick Score Summary

| App                    | Critical | Major | Minor | Score (/10,000) |
|------------------------|----------|-------|-------|-----------------|
| `bad-app/App.tsx`      | 4        | 2     | 1     | 7,900           |
| `medium-app/App.tsx`   | 0        | 2     | 1     | 9,500           |
| `good-app/App.tsx`     | 0        | 0     | 0     | 10,000          |

These scores are fully determined by the penalty model above, so the same code will always receive the same numeric result.

---

## Raw A11yScore Outputs (Structured JSON)

### `bad-app/App.tsx`

```json
{
  "critical": 4,
  "major": 2,
  "minor": 1,
  "computed_accessibility_score": 7900
}
```

**Detected issues (by category)**:

- **Critical**:
  - Missing `alt` attribute on `img`
  - Clickable `div` with `onClick` (non-semantic + keyboard-inaccessible)
  - Missing form label for `input`
  - Heading hierarchy violation (`h1` → `h3`, skipping `h2`)
- **Major**:
  - Missing `type` on `button` inside a form
  - Low-contrast text (`#aaa` on white background)
- **Minor**:
  - Non-descriptive link text (`<a href=\"#\">Click here</a>`)

---

### `medium-app/App.tsx`

```json
{
  "critical": 0,
  "major": 2,
  "minor": 1,
  "computed_accessibility_score": 9500
}
```

**Detected issues (by category)**:

- **Critical**:
  - None
- **Major**:
  - Missing `type` on the primary `button`
  - Slight contrast issue (`#ccc` on white background)
- **Minor**:
  - Non-descriptive link text (`<a href=\"#\">Click here</a>`)

---

### `good-app/App.tsx`

```json
{
  "critical": 0,
  "major": 0,
  "minor": 0,
  "computed_accessibility_score": 10000
}
```

**Detected issues (by category)**:

- **Critical**: None
- **Major**: None
- **Minor**: None

This example demonstrates:

- Proper heading hierarchy (`h1` → `h2`)
- Semantic layout (`main`, `header`, `section`, `footer`)
- Descriptive `alt` text on `img`
- Correct button `type` usage and ARIA labelling
- Properly associated form labels (`label` + `htmlFor` / `id`)
- `aria-describedby` wiring for help text
- Descriptive link text with a real destination

---

## Side-by-Side Comparison with Default Cursor (Claude)

This section reports how a **generic Cursor Claude assistant** actually behaved in our tests versus the **specialized A11yScore** agent. Claude was prompted in a simple, unspecialized way (e.g. “Review this React code for accessibility issues”), without any custom system prompt or scoring model.

### `bad-app/App.tsx`

- **Default Cursor (Claude)** in our runs:
  - Detected obvious issues such as:
    - Missing `alt` on `img`
    - Clickable `div` with `onClick`
    - Missing label for the text input
  - Did not consistently:
    - Call out the skipped heading level (`h1` → `h3`) as a distinct violation
    - Flag the missing `button` `type` as a problem
    - Treat color contrast as a first-class accessibility issue
  - Returned **unstructured prose** (paragraphs/bullets) without a severity taxonomy or numeric score.

- **A11yScore**:
  - Forces **strict categorization** into `critical`, `major`, and `minor`.
  - Always produces **machine-readable JSON** with a deterministic `computed_accessibility_score`.
  - Penalizes each violation consistently:
    - Multiple critical issues drive the score down to **7,900 / 10,000**, clearly signalling that this is an unsafe baseline for production.

### `medium-app/App.tsx`

- **Default Cursor (Claude)** in our runs:
  - Praised the overall structure and described the app as “mostly accessible”.
  - Treated the missing `button` `type` as low-priority and did not elevate it as a clear violation.
  - Mentioned the contrast issue and “Click here” link text as style/content suggestions without quantifying impact.
  - Did not produce a deterministic numeric score; feedback was purely qualitative prose.

- **A11yScore**:
  - Treats this as an **improved but imperfect** example:
    - No critical issues → strong baseline
    - Two major and one minor issue → **9,500 / 10,000**
  - Makes the trade-offs explicit:
    - Medium contrast and missing button `type` are not blockers but are tracked as major penalties.
    - Non-descriptive link text is counted as a minor, yet still measurable, violation.

### `good-app/App.tsx`

- **Default Cursor (Claude)** in our runs:
  - Responded with positive qualitative feedback.
  - Suggested optional refinements (for example, additional ARIA roles) that were not strictly required.
  - Did not reference a fixed scoring model or guarantee a repeatable “perfect score” outcome.

- **A11yScore**:
  - Recognizes that all critical, major, and minor categories are satisfied:
    - No missing `alt`, labels, or heading issues.
    - Proper semantics, ARIA wiring, and descriptive links.
  - Deterministically assigns **10,000 / 10,000**, making this a **canonical “good” baseline** for future regressions.

---

## Summary

- **A11yScore** turns accessibility review into a **strict, JSON-based scoring system** that is:
  - Deterministic (same inputs → same penalties → same score)
  - Machine-readable (ready for CI, dashboards, or regression tracking)
  - Tuned to critical React accessibility pitfalls (alt text, labels, semantics, headings, ARIA).
- **Default Cursor (Claude)** provides strong general advice but:
  - Lacks a stable severity taxonomy
  - Does not expose a reproducible 10,000-point scoring model
  - Produces prose that is harder to benchmark or automate.

