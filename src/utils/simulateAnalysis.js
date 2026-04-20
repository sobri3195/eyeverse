import { calculateRiskScore } from './riskCalculator';

export function simulateAnalysis({ moduleName, age, severity, symptoms = [], duration, hasComorbidity, hasImage }) {
  const { score, riskLevel } = calculateRiskScore({
    age: Number(age),
    severity: Number(severity),
    symptomCount: symptoms.length,
    duration: Number(duration),
    hasComorbidity,
    hasImage
  });

  const confidence = Math.max(55, Math.min(99, 65 + Math.round(score * 0.33) + (hasImage ? 4 : 0)));
  const likelyCondition =
    riskLevel === 'Tinggi' ? 'Perlu evaluasi retina lanjutan' : riskLevel === 'Sedang' ? 'Anomali ringan, monitoring disarankan' : 'Tidak ada anomali mayor terdeteksi';

  return {
    moduleName,
    confidence,
    riskLevel,
    score,
    likelyCondition,
    recommendation:
      riskLevel === 'Tinggi'
        ? 'Rujuk dokter mata dalam 24-48 jam dan lakukan OCT + fundus.'
        : riskLevel === 'Sedang'
          ? 'Kontrol 1-2 minggu, evaluasi gejala dan gaya hidup visual.'
          : 'Lanjutkan pemeriksaan rutin 6-12 bulan.',
    labels: hasImage ? ['retina-vessel', 'optic-disc', riskLevel === 'Tinggi' ? 'lesion-suspected' : 'healthy-zone'] : ['no-image-input'],
    chart: [
      { name: 'Skor Risiko', value: score },
      { name: 'Confidence', value: confidence },
      { name: 'Severity', value: Number(severity) * 20 }
    ]
  };
}
