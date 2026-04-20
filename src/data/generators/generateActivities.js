import { generateDate } from './base';

const actors = ['Admin', 'Dr. Sobri', 'Dr. Anisa', 'System'];
const activities = ['membuat laporan', 'menjalankan simulasi diagnosis', 'ekspor PDF', 'ekspor CSV', 'mengubah preferensi modul', 'upload scan'];

export function generateActivities(count = 200) {
  return Array.from({ length: count }, (_, i) => ({
    id: `A-${String(i + 1).padStart(5, '0')}`,
    actor: actors[i % actors.length],
    action: activities[i % activities.length],
    createdAt: generateDate(i),
    updatedAt: generateDate(i),
  }));
}
