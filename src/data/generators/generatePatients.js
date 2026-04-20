import { firstNames, lastNames, genders, eyeConditions, generateDate, pick, seededNumber } from './base';

export function generatePatients(count = 2000) {
  return Array.from({ length: count }, (_, i) => {
    const idNum = i + 1;
    const age = 8 + Math.floor(seededNumber(idNum) * 77);
    const eyeCondition = pick(eyeConditions, idNum + 9);
    const createdAt = generateDate(i * 3, 1000);
    return {
      id: `P-${String(idNum).padStart(5, '0')}`,
      name: `${pick(firstNames, idNum)} ${pick(lastNames, idNum + 77)}`,
      age,
      gender: pick(genders, idNum + 100),
      eyeCondition,
      medicalHistory: age > 50 ? ['Hipertensi'] : age > 35 ? ['Diabetes'] : ['None'],
      createdAt,
      updatedAt: generateDate(i * 3 - 2, 1000),
    };
  });
}
