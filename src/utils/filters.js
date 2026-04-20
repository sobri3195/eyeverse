export function applySearchFilterSort(items, { query = '', category = 'Semua', sort = 'name-asc' }) {
  const q = query.toLowerCase();
  const filtered = items.filter((item) => {
    const byQuery = (item.name || item.title || '').toLowerCase().includes(q);
    const byCategory = category === 'Semua' || item.category === category;
    return byQuery && byCategory;
  });

  return filtered.sort((a, b) => {
    if (sort === 'name-desc') return (b.name || '').localeCompare(a.name || '');
    if (sort === 'status') return Number(Boolean(b.active ?? b.available)) - Number(Boolean(a.active ?? a.available));
    if (sort === 'category') return (a.category || '').localeCompare(b.category || '');
    return (a.name || '').localeCompare(b.name || '');
  });
}
