export function seededNumber(seed) {
  const x = Math.sin(seed * 999) * 10000;
  return x - Math.floor(x);
}

export const firstNames = ['Andi', 'Budi', 'Citra', 'Dewi', 'Eko', 'Farah', 'Gilang', 'Hana', 'Indra', 'Jihan', 'Kevin', 'Lina', 'Maya', 'Nanda', 'Omar', 'Putri', 'Qori', 'Rafi', 'Sinta', 'Tomi', 'Uli', 'Vina', 'Wira', 'Yuni', 'Zaki'];
export const lastNames = ['Pratama', 'Saputra', 'Wijaya', 'Nugroho', 'Kusuma', 'Permata', 'Lestari', 'Hidayat', 'Santoso', 'Utami'];
export const genders = ['Pria', 'Wanita'];
export const eyeConditions = ['Katarak', 'Glaukoma', 'Retinopati Diabetik', 'Degenerasi Makula', 'Mata Kering', 'Konjungtivitis', 'Keratoconus', 'Ablasi Retina', 'Edema Makula'];
export const scanTypes = ['Fundus', 'OCT', 'Slit Lamp', 'Visual Field', 'Topography'];
export const doctors = ['Dr. Sobri', 'Dr. Anisa', 'Dr. Rahman', 'Dr. Laila', 'Dr. Fikri', 'Dr. Kartika'];
export const reportStatus = ['Draft', 'Final', 'Reviewed'];
export const riskLevels = ['Rendah', 'Sedang', 'Tinggi'];

export function generateDate(index, maxDaysBack = 720) {
  const d = new Date('2026-04-20T00:00:00Z');
  const offset = index % maxDaysBack;
  d.setUTCDate(d.getUTCDate() - offset);
  return d.toISOString().slice(0, 10);
}

export function pick(arr, seed) {
  return arr[Math.floor(seededNumber(seed) * arr.length) % arr.length];
}
