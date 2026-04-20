export const patients = Array.from({ length: 80 }, (_, i) => ({
  id: `P-${String(i + 1).padStart(3, '0')}`,
  name: `Pasien ${i + 1}`,
  age: 18 + (i % 65),
  risk: ['Rendah', 'Sedang', 'Tinggi'][i % 3],
  lastVisit: `2026-${String((i % 4) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`
}));
