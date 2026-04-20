import { aiTechnologies } from './aiTechnologies';
import { eyeTechnologies } from './eyeTechnologies';

const coreSymptoms = [
  'penglihatan kabur', 'silau', 'halo', 'nyeri mata', 'mata merah', 'gatal', 'berair', 'fotofobia', 'distorsi visual', 'lapang pandang menyempit',
  'floaters', 'kilatan cahaya', 'mata kering', 'penglihatan ganda', 'kesulitan fokus', 'warna pudar', 'penglihatan malam menurun', 'tekanan intraokular tinggi',
  'kornea menipis', 'ketajaman menurun', 'iritasi', 'kelopak bengkak', 'sekret', 'mata cepat lelah', 'mata perih', 'mata terasa berat', 'sensitif cahaya',
  'sakit kepala orbital', 'mata berpasir', 'kebutaan sebagian',
];

const conditions = [
  'Katarak', 'Glaukoma', 'Retinopati Diabetik', 'Degenerasi Makula', 'Penyakit Retina', 'Edema Makula', 'Ablasi Retina', 'Keratoconus',
  'Konjungtivitis', 'Dry Eye Syndrome', 'Kelainan Pupil', 'Gangguan Iris', 'Strabismus', 'Infeksi Mata', 'Gangguan Lapang Pandang', 'Kelainan Kornea'
];

export const conditionProfiles = conditions.map((name, idx) => ({
  name,
  baseRisk: 25 + (idx % 6) * 7,
  symptomWeights: Object.fromEntries(coreSymptoms.slice(idx % 5, (idx % 5) + 8).map((sym, i) => [sym, 6 + (i % 5) * 2])),
  highRiskHistory: idx % 2 === 0 ? ['Diabetes', 'Hipertensi'] : ['Riwayat Glaukoma', 'Autoimun'],
  recommendedScans: ['Fundus', 'OCT', 'Slit Lamp', 'Visual Field', 'Topography'].slice(0, 2 + (idx % 3)),
}));

export const symptomLibrary = Array.from({ length: 220 }, (_, i) => ({
  id: `SYM-${String(i + 1).padStart(3, '0')}`,
  symptom: coreSymptoms[i % coreSymptoms.length],
  aliases: [`varian-${i + 1}`, `keluhan-${i + 1}`],
  severityWeight: 2 + (i % 9),
}));

export const symptomConditionMappings = Array.from({ length: 240 }, (_, i) => ({
  symptom: coreSymptoms[i % coreSymptoms.length],
  condition: conditions[i % conditions.length],
  weight: 5 + (i % 11),
  evidence: `Aturan klinis mock #${i + 1}`,
}));

export const recommendationRules = Array.from({ length: 120 }, (_, i) => ({
  condition: conditions[i % conditions.length],
  ruleKey: `REC-${i + 1}`,
  action: ['Lakukan OCT', 'Tonometer', 'Fundus Camera', 'Visual Acuity Test', 'Topografi Kornea', 'Kontrol 14 hari', 'Monitoring 30 hari'][i % 7],
  priority: ['Low', 'Medium', 'High', 'Critical'][i % 4],
}));

export const explainabilityTemplates = Array.from({ length: 60 }, (_, i) =>
  `Template #${i + 1}: Sistem memprioritaskan gejala dominan, faktor usia, komorbid, tipe scan, dan riwayat pemeriksaan sebelumnya.`
);

export const scanTypeMaps = {
  Fundus: { retinaBoost: 1.2, glaucomaBoost: 1.05 },
  OCT: { retinaBoost: 1.3, glaucomaBoost: 1.2, corneaBoost: 1.1 },
  'Slit Lamp': { cataractBoost: 1.25, conjunctivitisBoost: 1.15 },
  'Visual Field': { glaucomaBoost: 1.3, triageBoost: 1.1 },
  Topography: { keratoconusBoost: 1.35, corneaBoost: 1.25 },
};

export const technologyRelations = aiTechnologies.map((module, idx) => ({
  moduleId: module.id,
  moduleName: module.name,
  relatedDevices: [eyeTechnologies[idx % eyeTechnologies.length].name, eyeTechnologies[(idx + 4) % eyeTechnologies.length].name],
  compatibleScans: ['Fundus', 'OCT', 'Slit Lamp', 'Visual Field', 'Topography'].slice(0, 2 + (idx % 3)),
}));

export const deviceRelationProfiles = Array.from({ length: 20 }, (_, i) => ({
  device: eyeTechnologies[i % eyeTechnologies.length].name,
  bestFor: conditions[i % conditions.length],
  compatibilityScore: 60 + (i % 35),
}));

const intents = ['penyakit', 'teknologi_ai', 'alat', 'gejala', 'edukasi', 'interpretasi', 'alur_pemeriksaan'];
export const chatbotIntents = Array.from({ length: 120 }, (_, i) => ({
  id: `INT-${i + 1}`,
  intent: intents[i % intents.length],
  keywords: [coreSymptoms[i % coreSymptoms.length], conditions[i % conditions.length].toLowerCase(), aiTechnologies[i % aiTechnologies.length].name.toLowerCase()],
  response: `Insight ${intents[i % intents.length]} #${i + 1}: evaluasi gejala, validasi scan, dan tindak lanjut klinis.`,
  suggestions: ['Cek modul diagnosis', 'Bandingkan dengan pemeriksaan sebelumnya', 'Lihat rekomendasi perangkat'],
}));

export const reportTemplates = {
  header: 'EYEVERSE AI - Smart Ophthalmology Report',
  footer: 'Created by Dr. Sobri',
  sections: ['identitas', 'input klinis', 'hasil analisis', 'explainability', 'rekomendasi', 'monitoring'],
};
