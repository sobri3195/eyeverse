import { riskCalculator } from './riskCalculator';

export function simulateAnalysis({ patient, scanType, symptoms, aiModule }) {
  const { score, riskLevel } = riskCalculator({ age: patient.age, symptoms, scanType, history: patient.medicalHistory || [] });
  const confidenceScore = Math.min(98, 62 + Math.floor(score / 2));
  const diagnosisResult = `${patient.eyeCondition} terdeteksi melalui ${scanType} (${aiModule}).`;
  const recommendations = riskLevel === 'Tinggi' ? 'Lakukan pemeriksaan lanjutan segera.' : riskLevel === 'Sedang' ? 'Kontrol ulang dalam 2 minggu.' : 'Lanjutkan monitoring berkala.';

  return {
    score,
    riskLevel,
    confidenceScore,
    diagnosisResult,
    recommendations,
    chart: [
      { name: 'Risk Score', value: score },
      { name: 'Confidence', value: confidenceScore },
    ],
  };
}
