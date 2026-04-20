import { aiTechnologies } from '../data/aiTechnologies';
import { eyeTechnologies } from '../data/eyeTechnologies';
import { generatePatients } from '../data/generators/generatePatients';
import { generateScans } from '../data/generators/generateScans';
import { generateReports } from '../data/generators/generateReports';
import { generateHistories } from '../data/generators/generateHistories';
import { generateActivities } from '../data/generators/generateActivities';

export function generateEducationArticles(count = 100) {
  const categories = ['Pencegahan', 'Nutrisi', 'Penyakit Mata', 'Tips Digital Eye Strain', 'FAQ'];
  return Array.from({ length: count }, (_, i) => ({
    id: `E-${String(i + 1).padStart(4, '0')}`,
    title: `Edukasi Mata #${i + 1}`,
    category: categories[i % categories.length],
    content: `Panduan edukasi ke-${i + 1} mengenai kesehatan mata, skrining berkala, pola tidur, nutrisi, dan kebiasaan visual.` ,
    createdAt: `2026-03-${String((i % 28) + 1).padStart(2, '0')}`,
    updatedAt: `2026-04-${String((i % 20) + 1).padStart(2, '0')}`,
  }));
}

export function generateChatbotKnowledge(count = 100) {
  const intents = ['gejala', 'jadwal', 'teknologi_ai', 'alat_mata', 'rekomendasi'];
  return Array.from({ length: count }, (_, i) => ({
    id: `KB-${String(i + 1).padStart(4, '0')}`,
    keyword: ['katarak', 'glaukoma', 'mata kering', 'fundus', 'oct'][i % 5],
    intent: intents[i % intents.length],
    response: `Penjelasan untuk intent ${intents[i % intents.length]} pada konteks kesehatan mata #${i + 1}.`,
    suggestion: `Coba buka modul AI ${((i % 41) + 1)} untuk analisis detail.`,
    category: i % 2 ? 'klinis' : 'umum',
  }));
}

export function buildSeedData() {
  const patients = generatePatients(2000);
  const scans = generateScans(patients, aiTechnologies, eyeTechnologies, 1500);
  const reports = generateReports(scans, 800);
  const histories = generateHistories(patients, reports, 300);
  const activities = generateActivities(200);
  const educationArticles = generateEducationArticles(100);
  const chatbotKnowledge = generateChatbotKnowledge(100);

  return {
    aiTechnologies,
    eyeTechnologies,
    patients,
    scans,
    reports,
    histories,
    activities,
    educationArticles,
    chatbotKnowledge,
    totalRecords:
      patients.length + scans.length + reports.length + histories.length + activities.length + educationArticles.length + chatbotKnowledge.length,
  };
}
