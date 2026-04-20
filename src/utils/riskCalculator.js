import { runRuleEngine } from './ruleEngine';
import { runScoreEngine } from './scoreEngine';

export function riskCalculator(input) {
  const rules = runRuleEngine(input);
  const scores = runScoreEngine(input, rules.ranked);
  const riskLevel = scores.diseaseProbability >= 75 ? 'Tinggi' : scores.diseaseProbability >= 45 ? 'Sedang' : 'Rendah';
  const severityLevel = scores.severityScore >= 75 ? 'Severe' : scores.severityScore >= 45 ? 'Moderate' : 'Mild';
  return { ...scores, riskLevel, severityLevel, rules };
}
