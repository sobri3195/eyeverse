const aiNames = [
  'AI Deteksi Katarak','AI Deteksi Glaukoma','AI Deteksi Retinopati Diabetik','AI Deteksi Degenerasi Makula','AI Deteksi Penyakit Retina','AI Analisis Fundus Otomatis','AI Analisis OCT','AI Segmentasi Retina','AI Segmentasi Pembuluh Darah Retina','AI Deteksi Edema Makula','AI Deteksi Ablasi Retina','AI Analisis Kornea','AI Analisis Iris','AI Identifikasi Kelainan Pupil','AI Deteksi Mata Kering','AI Prediksi Risiko Kebutaan','AI Prediksi Perkembangan Glaukoma','AI Screening Mata Anak','AI Analisis Strabismus','AI Deteksi Konjungtivitis','AI Deteksi Keratoconus','AI Analisis Tajam Penglihatan','AI Rekomendasi Lensa/Kacamata','AI Deteksi Kelainan Warna Mata','AI Eye Tracking Analytics','AI Analisis Gerakan Bola Mata','AI Monitoring Pasca Operasi Mata','AI Asisten Dokter Mata','AI Chatbot Edukasi Mata','AI Rekomendasi Terapi Mata','AI Evaluasi Hasil Operasi Katarak','AI Penilaian Kesehatan Retina','AI Klasifikasi Citra Mata','AI Pencocokan Gejala Mata','AI Triase Pasien Mata','AI Deteksi Infeksi Mata','AI Pendeteksi Keparahan Penyakit Mata','AI Pelacakan Perubahan Retina Berkala','AI Visual Field Prediction','AI Smart Report Generator Oftalmologi','AI Sistem Skor Kesehatan Mata Menyeluruh'
];

const categories = ['Diagnostik AI', 'Analisis Citra', 'Prediksi Risiko', 'Monitoring', 'Edukasi', 'Screening', 'Laporan'];
const icons = ['Brain', 'Eye', 'ScanEye', 'Radar', 'ShieldCheck', 'Activity', 'Bot'];

export const aiTechnologies = aiNames.map((name, index) => ({
  id: `ai-${index + 1}`,
  name,
  slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
  category: categories[index % categories.length],
  icon: icons[index % icons.length],
  shortDescription: `Analisis ${name.toLowerCase()} untuk skrining cepat dan dukungan keputusan klinis.`,
  fullDescription: `${name} menggunakan rules engine client-side untuk membaca gejala, data pasien, dan hasil scan mock agar simulasi diagnosis lebih realistis.`,
  manfaat: ['Mempercepat skrining', 'Meningkatkan konsistensi evaluasi', 'Mendukung keputusan dokter'],
  active: index % 9 !== 0,
  confidenceScore: 70 + (index % 28),
  riskLevel: ['Rendah', 'Sedang', 'Tinggi'][index % 3],
  inputForm: ['usia', 'severitas', 'durasi', 'komorbid', 'keluhanUtama'],
  dummyHistory: [`Simulasi ${index + 1} selesai`, `Confidence awal ${72 + (index % 20)}%`],
  relatedTechnologies: [`eye-${(index % 20) + 1}`, `eye-${((index + 5) % 20) + 1}`],
  miniChart: [
    { name: 'T1', value: 40 + (index % 35) },
    { name: 'T2', value: 45 + (index % 40) },
    { name: 'T3', value: 50 + (index % 30) }
  ]
}));

export const aiCategories = ['Semua', ...new Set(aiTechnologies.map((item) => item.category))];
