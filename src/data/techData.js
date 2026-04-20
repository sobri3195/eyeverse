import {
  Activity,
  Brain,
  ScanEye,
  Stethoscope,
  Microscope,
  Radar,
  ShieldCheck,
  Eye,
  Bot,
  FileBarChart
} from 'lucide-react';

const categories = ['Diagnostik AI', 'Analisis Citra', 'Prediksi Risiko', 'Monitoring', 'Edukasi', 'Screening', 'Laporan'];

export const aiTechnologyNames = [
  'AI Deteksi Katarak',
  'AI Deteksi Glaukoma',
  'AI Deteksi Retinopati Diabetik',
  'AI Deteksi Degenerasi Makula',
  'AI Deteksi Penyakit Retina',
  'AI Analisis Fundus Otomatis',
  'AI Analisis OCT',
  'AI Segmentasi Retina',
  'AI Segmentasi Pembuluh Darah Retina',
  'AI Deteksi Edema Makula',
  'AI Deteksi Ablasi Retina',
  'AI Analisis Kornea',
  'AI Analisis Iris',
  'AI Identifikasi Kelainan Pupil',
  'AI Deteksi Mata Kering',
  'AI Prediksi Risiko Kebutaan',
  'AI Prediksi Perkembangan Glaukoma',
  'AI Screening Mata Anak',
  'AI Analisis Strabismus',
  'AI Deteksi Konjungtivitis',
  'AI Deteksi Keratoconus',
  'AI Analisis Tajam Penglihatan',
  'AI Rekomendasi Lensa/Kacamata',
  'AI Deteksi Kelainan Warna Mata',
  'AI Eye Tracking Analytics',
  'AI Analisis Gerakan Bola Mata',
  'AI Monitoring Pasca Operasi Mata',
  'AI Asisten Dokter Mata',
  'AI Chatbot Edukasi Mata',
  'AI Rekomendasi Terapi Mata',
  'AI Evaluasi Hasil Operasi Katarak',
  'AI Penilaian Kesehatan Retina',
  'AI Klasifikasi Citra Mata',
  'AI Pencocokan Gejala Mata',
  'AI Triase Pasien Mata',
  'AI Deteksi Infeksi Mata',
  'AI Pendeteksi Keparahan Penyakit Mata',
  'AI Pelacakan Perubahan Retina Berkala',
  'AI Visual Field Prediction',
  'AI Smart Report Generator Oftalmologi',
  'AI Sistem Skor Kesehatan Mata Menyeluruh'
];

const aiIcons = [Brain, ScanEye, Activity, Radar, ShieldCheck, Bot, FileBarChart];

export const aiTechnologies = aiTechnologyNames.map((name, idx) => ({
  id: `ai-${idx + 1}`,
  name,
  icon: aiIcons[idx % aiIcons.length],
  category: categories[idx % categories.length],
  shortDescription: `Modul simulasi ${name.toLowerCase()} untuk analisis klinis cepat dan akurat berbasis data citra mata.`,
  benefits: ['Akurasi klinis meningkat', 'Waktu screening lebih cepat', 'Mendukung keputusan dokter'],
  active: true,
  confidence: 82 + (idx % 15),
  riskLevel: ['Rendah', 'Sedang', 'Tinggi'][idx % 3],
  usage: [
    { name: 'M1', value: 50 + (idx % 20) },
    { name: 'M2', value: 65 + (idx % 15) },
    { name: 'M3', value: 70 + (idx % 12) }
  ],
  history: [`Scan retina #${1000 + idx}`, `Evaluasi pasien #${2000 + idx}`, `Laporan #${3000 + idx}`]
}));

export const eyeTechnologies = [
  'Fundus Camera', 'OCT Scanner', 'Slit Lamp', 'Tonometer', 'Autorefractor', 'Lensometer', 'Keratometer',
  'Phoropter', 'Visual Field Analyzer', 'Retinoscope', 'Ophthalmoscope', 'Pachymeter', 'Corneal Topography',
  'Biomikroskop Mata', 'Alat Tes Buta Warna', 'Snellen Chart Digital', 'Trial Lens Set',
  'Microsurgical Eye Tools', 'Intraocular Lens Simulator', 'Smart Eye Examination Kit'
].map((name, idx) => ({
  id: `eye-${idx + 1}`,
  name,
  icon: [Eye, Microscope, Stethoscope][idx % 3],
  category: idx > 16 ? 'Bedah Mata' : 'Perangkat Pemeriksaan',
  description: `${name} adalah perangkat modern untuk evaluasi oftalmologi dengan integrasi workflow digital.`,
  function: 'Mendukung pemeriksaan objektif dan dokumentasi hasil secara konsisten.',
  spec: `Resolusi tinggi ${2 + (idx % 6)}K, integrasi USB/WiFi, mode klinik premium.`,
  workflow: 'Kalibrasi alat, lakukan pemeriksaan, simpan hasil, dan sinkronisasi ke dashboard.',
  aiIntegration: idx % 2 === 0 ? 'Terhubung dengan modul AI analisis citra' : 'Integrasi opsional dengan AI prediksi risiko',
  available: true
}));
