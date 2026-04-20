const names = ['Fundus Camera','OCT Scanner','Slit Lamp','Tonometer','Autorefractor','Lensometer','Keratometer','Phoropter','Visual Field Analyzer','Retinoscope','Ophthalmoscope','Pachymeter','Corneal Topography','Biomikroskop Mata','Alat Tes Buta Warna','Snellen Chart Digital','Trial Lens Set','Microsurgical Eye Tools','Intraocular Lens Simulator','Smart Eye Examination Kit'];
const icons = ['Camera', 'Microscope', 'Stethoscope', 'Eye'];

export const eyeTechnologies = names.map((name, index) => ({
  id: `eye-${index + 1}`,
  namaAlat: name,
  name,
  slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
  category: index > 16 ? 'Bedah Mata' : 'Perangkat Pemeriksaan',
  icon: icons[index % icons.length],
  description: `${name} merupakan perangkat oftalmologi modern untuk pemeriksaan presisi tinggi.`,
  fungsi: 'Melakukan evaluasi struktur/fungsi mata dan mendukung dokumentasi klinis.',
  spesifikasi: `Resolusi ${2 + (index % 5)}K, port USB-C, mode klinik, auto-calibration.`,
  caraKerja: 'Kalibrasi → pemeriksaan pasien → validasi hasil → simpan ke sistem.',
  available: index % 7 !== 0,
  simulasiPenggunaan: `Sesi simulasi ${name}: alat siap, mode pemeriksaan diaktifkan, hasil mock tersimpan.`,
  integrasiAI: [`ai-${(index % 41) + 1}`, `ai-${((index + 11) % 41) + 1}`]
}));

export const eyeCategories = ['Semua', ...new Set(eyeTechnologies.map((item) => item.category))];
