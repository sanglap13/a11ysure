export function calculateAccessibilityScore(
  critical: number,
  major: number,
  minor: number,
): number {
  const baseScore = 10000;

  const penalty = critical * 400 + major * 200 + minor * 100;

  const finalScore = baseScore - penalty;

  return finalScore < 0 ? 0 : finalScore;
}
