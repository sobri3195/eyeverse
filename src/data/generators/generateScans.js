import { generateDate, pick, scanTypes, seededNumber } from './base';

export function generateScans(patients, aiTechnologies, eyeTechnologies, count = 1500) {
  return Array.from({ length: count }, (_, i) => {
    const idNum = i + 1;
    const patient = patients[(i * 7) % patients.length];
    const module = aiTechnologies[(i * 5) % aiTechnologies.length];
    const device = eyeTechnologies[(i * 3) % eyeTechnologies.length];
    const confidenceScore = 65 + Math.round(seededNumber(idNum + 8) * 34);
    return {
      id: `S-${String(idNum).padStart(5, '0')}`,
      patientId: patient.id,
      patientName: patient.name,
      age: patient.age,
      gender: patient.gender,
      eyeCondition: patient.eyeCondition,
      scanType: pick(scanTypes, idNum),
      analysisDate: generateDate(i),
      doctor: i % 2 === 0 ? 'Dr. Sobri' : 'Dr. Anisa',
      confidenceScore,
      moduleUsed: module.name,
      moduleId: module.id,
      eyeDevice: device.name,
      eyeDeviceId: device.id,
      createdAt: generateDate(i),
      updatedAt: generateDate(i - 1),
    };
  });
}
