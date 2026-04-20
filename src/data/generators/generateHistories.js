import { generateDate, pick, riskLevels } from './base';

const actions = ['Monitoring', 'Follow Up', 'Telekonsultasi', 'Terapi', 'Evaluasi'];

export function generateHistories(patients, reports, count = 300) {
  return Array.from({ length: count }, (_, i) => {
    const idNum = i + 1;
    const patient = patients[(i * 11) % patients.length];
    const report = reports[(i * 3) % reports.length];
    return {
      id: `H-${String(idNum).padStart(5, '0')}`,
      patientId: patient.id,
      patientName: patient.name,
      action: pick(actions, idNum),
      riskLevel: pick(riskLevels, idNum + 20),
      linkedReportId: report.id,
      note: `Riwayat ${patient.eyeCondition} dengan status laporan ${report.status}`,
      createdAt: generateDate(i * 2),
      updatedAt: generateDate(i * 2 - 1),
    };
  });
}
