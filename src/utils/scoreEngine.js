import { normalizeToPercent } from './seededLogic';
import { scanTypeMaps } from '../data/aiKnowledge';

export function runScoreEngine(input, rankedRules) {
  const top = rankedRules[0] || { condition: 'Tidak terklasifikasi', score: 0 };
  const second = rankedRules[1] || { score: 0, condition: '-' };
  const severityBase = input.severityLevel === 'severe' ? 80 : input.severityLevel === 'moderate' ? 58 : 36;
  const ageMod = input.age >= 65 ? 12 : input.age >= 50 ? 6 : 0;
  const chronicMod = (input.medicalHistory || []).length * 4;
  const scanMod = Object.values(scanTypeMaps[input.scanType] || {}).reduce((a, b) => a + b, 0) * 3;

  const diseaseProbability = normalizeToPercent(top.score + ageMod + chronicMod + scanMod, 0, 180);
  const confidence = normalizeToPercent(top.score - second.score + 55 + scanMod, 0, 120);
  const severityScore = normalizeToPercent(severityBase + chronicMod + ageMod, 0, 120);
  const urgencyScore = normalizeToPercent((diseaseProbability * 0.45) + (severityScore * 0.35) + (input.durationDays > 14 ? 20 : 8), 0, 130);
  const eyeHealthScore = Math.max(10, 100 - Math.round((diseaseProbability * 0.5) + (severityScore * 0.25)));

  return {
    probableCondition: top.condition,
    alternativeConditions: rankedRules.slice(1, 4).map((r) => ({ condition: r.condition, probability: normalizeToPercent(r.score, 0, 160) })),
    diseaseProbability,
    confidence,
    severityScore,
    urgencyScore,
    eyeHealthScore,
  };
}
