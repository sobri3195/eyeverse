import { explainabilityTemplates } from '../data/aiKnowledge';
import { seededPick } from './seededLogic';

export function buildExplainability(input, scored, ruleReasons = []) {
  const symptomHighlights = (input.symptoms || []).slice(0, 4);
  const factors = [
    `Usia ${input.age} tahun`,
    `Gejala dominan: ${symptomHighlights.join(', ') || 'tidak diisi'}`,
    `Riwayat: ${(input.medicalHistory || []).join(', ') || 'tidak ada'}`,
    `Scan: ${input.scanType}`,
    `Modul: ${input.aiModule}`,
  ];

  const template = seededPick(explainabilityTemplates, `${input.aiModule}-${scored.probableCondition}`, 2);
  return {
    topFactors: factors,
    reasoningSummary: [...ruleReasons, ...template],
    whyThisResult: `Skor tertinggi jatuh pada ${scored.probableCondition} karena kombinasi faktor klinis dan scan menunjukkan pola paling konsisten.`,
    patientSummary: `Kemungkinan utama ${scored.probableCondition} dengan keyakinan ${scored.confidence}%. Disarankan evaluasi lanjutan sesuai prioritas.`,
    technicalSummary: `Prob=${scored.diseaseProbability} | Conf=${scored.confidence} | Sev=${scored.severityScore} | Urgency=${scored.urgencyScore}.`,
  };
}
