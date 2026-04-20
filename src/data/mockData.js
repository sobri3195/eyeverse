import { aiTechnologies, eyeTechnologies } from './techData';

export const roles = ['admin', 'dokter', 'peneliti', 'pasien'];

export const patients = Array.from({ length: 50 }, (_, i) => ({
  id: `P-${String(i + 1).padStart(3, '0')}`,
  name: `Pasien ${i + 1}`,
  age: 20 + (i % 55),
  risk: ['Rendah', 'Sedang', 'Tinggi'][i % 3],
  lastVisit: `2026-03-${String((i % 28) + 1).padStart(2, '0')}`
}));

export const scans = Array.from({ length: 50 }, (_, i) => ({
  id: `S-${String(i + 1).padStart(3, '0')}`,
  type: i % 2 === 0 ? 'Fundus' : 'OCT',
  patientId: patients[i % patients.length].id,
  date: `2026-04-${String((i % 20) + 1).padStart(2, '0')}`,
  confidence: 78 + (i % 20)
}));

export const reports = Array.from({ length: 20 }, (_, i) => ({
  id: `R-${String(i + 1).padStart(3, '0')}`,
  patient: patients[i].name,
  module: aiTechnologies[i % aiTechnologies.length].name,
  status: ['Draft', 'Final', 'Reviewed'][i % 3],
  date: `2026-04-${String((i % 18) + 1).padStart(2, '0')}`
}));

export const diseaseStats = [
  { name: 'Katarak', value: 24 },
  { name: 'Glaukoma', value: 18 },
  { name: 'Retinopati', value: 22 },
  { name: 'Makula', value: 14 },
  { name: 'Mata Kering', value: 12 }
];

export const usageStats = [
  { month: 'Jan', ai: 140, eye: 80 },
  { month: 'Feb', ai: 165, eye: 91 },
  { month: 'Mar', ai: 188, eye: 99 },
  { month: 'Apr', ai: 210, eye: 112 }
];

export const latestActivities = [
  'AI Analisis OCT selesai untuk pasien P-010',
  'Laporan R-014 diekspor ke PDF',
  'Dokter memperbarui simulasi diagnosis glaukoma',
  'Admin menambahkan modul edukasi retina'
];

export const summary = {
  totalAI: aiTechnologies.length,
  totalEye: eyeTechnologies.length,
  totalPatients: patients.length,
  totalScans: scans.length,
  totalReports: reports.length
};
