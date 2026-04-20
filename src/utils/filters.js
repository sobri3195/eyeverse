export function globalSearchFilter(items, query, fields) {
  if (!query) return items;
  const q = query.toLowerCase();
  return items.filter((item) => fields.some((field) => String(item[field] ?? '').toLowerCase().includes(q)));
}

export function categoryFilter(items, key, value) {
  if (!value || value === 'Semua') return items;
  return items.filter((item) => item[key] === value);
}
