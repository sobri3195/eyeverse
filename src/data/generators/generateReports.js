import { generateDate, pick, reportStatus, riskLevels } from './base';

export function generateReports(scans, count = 800) {
  return Array.from({ length: count }, (_, i) => {
    const idNum = i + 1;
    const scan = scans[(i * 2) % scans.length];
    const riskLevel = pick(riskLevels, idNum + scan.age);
    const diagnosisResult = `${scan.eyeCondition} ${riskLevel === 'Tinggi' ? 'membutuhkan tindakan cepat' : 'perlu monitoring berkala'}`;
    return {
      id: `R-${String(idNum).padStart(5, '0')}`,
      scanId: scan.id,
      patientId: scan.patientId,
      patientName: scan.patientName,
      age: scan.age,
      gender: scan.gender,
      eyeCondition: scan.eyeCondition,
      scanType: scan.scanType,
      analysisDate: scan.analysisDate,
      doctor: scan.doctor,
      confidenceScore: scan.confidenceScore,
      riskLevel,
      diagnosisResult,
      recommendations: riskLevel === 'Tinggi' ? 'Rujuk subspesialis retina dalam 24 jam' : 'Kontrol ulang 2-4 minggu',
      moduleUsed: scan.moduleUsed,
      status: pick(reportStatus, idNum),
      createdAt: generateDate(i),
      updatedAt: generateDate(i - 2),
    };
  });
}
