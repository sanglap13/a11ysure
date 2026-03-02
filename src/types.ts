export type TAuditCategory = "critical" | "major" | "minor";

export interface IAuditIssue {
  category: TAuditCategory;
  message: string;
  suggestion: string;
}

export interface IAuditSummary {
  critical: number;
  major: number;
  minor: number;
  computed_accessibility_score: number;
}
