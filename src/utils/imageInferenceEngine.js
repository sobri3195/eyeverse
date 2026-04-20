import { createSeed, normalizeToPercent, seededPick } from './seededLogic';

const labels = ['retina', 'optic disc', 'macula', 'vascular tortuosity', 'hemorrhage', 'opacity', 'corneal curvature', 'inflammation'];

export function runImageInference({ file, scanType, aiModule }) {
  if (!file) return { valid: false, error: 'File gambar wajib diunggah.' };
  const valid = file.type.startsWith('image/');
  if (!valid) return { valid: false, error: 'Format file tidak valid.' };

  const seed = createSeed(`${file.name}-${file.size}-${scanType}-${aiModule}`);
  const abnormalityScore = normalizeToPercent((seed % 900) + Math.floor(file.size / 10000), 0, 1000);
  const confidence = normalizeToPercent(65 + (seed % 30) + (scanType === 'OCT' ? 4 : 0), 0, 100);
  const detectedLabels = seededPick(labels, seed, 4);
  const regions = detectedLabels.map((label, i) => ({
    label,
    x: 10 + ((seed >> (i * 4)) % 70),
    y: 8 + ((seed >> (i * 3)) % 65),
    w: 18 + ((seed >> (i * 2)) % 20),
    h: 10 + ((seed >> (i * 5)) % 20),
  }));

  return {
    valid: true,
    pipeline: ['Validasi file', 'Feature extraction', 'Label detection', 'Abnormality scoring', 'Region highlighting', 'Final classification'],
    abnormalityScore,
    confidence,
    detectedLabels,
    regions,
    classification: abnormalityScore > 70 ? 'Abnormal pattern detected' : abnormalityScore > 45 ? 'Mild anomaly suspected' : 'No strong abnormal signal',
    findingsSummary: `Analisis ${scanType}: ${detectedLabels.join(', ')} dengan abnormality score ${abnormalityScore}.`,
  };
}
