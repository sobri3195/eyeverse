export function calculateRiskScore({ age = 30, severity = 1, symptomCount = 1, duration = 1, hasComorbidity = false, hasImage = false }) {
  let score = age * 0.35 + severity * 16 + symptomCount * 7 + duration * 3;
  if (hasComorbidity) score += 12;
  if (hasImage) score += 6;
  const capped = Math.max(5, Math.min(99, Math.round(score / 2)));
  const riskLevel = capped >= 70 ? 'Tinggi' : capped >= 40 ? 'Sedang' : 'Rendah';
  return { score: capped, riskLevel };
}
