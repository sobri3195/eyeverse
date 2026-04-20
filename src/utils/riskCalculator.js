export function riskCalculator({ age, symptoms = [], scanType, history = [] }) {
  let score = 30;
  if (age > 50) score += 20;
  if (age > 65) score += 10;
  if (['OCT', 'Fundus'].includes(scanType)) score += 10;
  score += Math.min(symptoms.length * 8, 24);
  if (history.includes('Diabetes')) score += 15;
  if (history.includes('Hipertensi')) score += 8;
  const riskLevel = score >= 70 ? 'Tinggi' : score >= 45 ? 'Sedang' : 'Rendah';
  return { score, riskLevel };
}
