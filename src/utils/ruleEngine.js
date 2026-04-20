import { conditionProfiles, symptomConditionMappings } from '../data/aiKnowledge';

const normalize = (text) => (text || '').toString().trim().toLowerCase();

export function runRuleEngine(input) {
  const symptoms = (input.symptoms || []).map(normalize).filter(Boolean);
  const history = (input.medicalHistory || []).map(normalize);
  const scoreMap = Object.fromEntries(conditionProfiles.map((c) => [c.name, c.baseRisk]));
  const reasons = [];

  symptomConditionMappings.forEach((map) => {
    if (symptoms.includes(normalize(map.symptom))) {
      scoreMap[map.condition] += map.weight;
    }
  });

  if (input.age > 55 && symptoms.includes('penglihatan kabur') && symptoms.includes('silau')) {
    scoreMap.Katarak += 22;
    reasons.push('Usia >55 + kabur + silau meningkatkan indikasi katarak');
  }
  if ((symptoms.includes('tekanan intraokular tinggi') || input.intraocularPressure === 'high') && symptoms.includes('nyeri mata')) {
    scoreMap.Glaukoma += 24;
    reasons.push('Tekanan intraokular dan nyeri mata mengarah ke glaukoma');
  }
  if (history.includes('diabetes') && (input.scanFindings || '').toLowerCase().includes('abnormal')) {
    scoreMap['Retinopati Diabetik'] += 25;
    reasons.push('Diabetes + fundus abnormal mendukung retinopati diabetik');
  }
  if (symptoms.includes('mata merah') && symptoms.includes('gatal') && symptoms.includes('berair')) {
    scoreMap.Konjungtivitis += 20;
    reasons.push('Triad mata merah-gatal-berair kuat untuk konjungtivitis');
  }
  if ((input.corneaStatus || '').toLowerCase().includes('abnormal') && symptoms.includes('distorsi visual')) {
    scoreMap.Keratoconus += 20;
    reasons.push('Kornea abnormal + distorsi visual sesuai pola keratoconus');
  }

  if (input.durationDays > 30) {
    Object.keys(scoreMap).forEach((k) => { scoreMap[k] += 3; });
    reasons.push('Durasi gejala >30 hari menaikkan bobot kronis');
  }

  const ranked = Object.entries(scoreMap).sort((a, b) => b[1] - a[1]).map(([condition, score]) => ({ condition, score }));
  return { ranked, reasons };
}
