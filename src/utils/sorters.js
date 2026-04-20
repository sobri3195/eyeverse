export function sortRecords(items, sortKey) {
  const list = [...items];
  switch (sortKey) {
    case 'newest':
      return list.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
    case 'oldest':
      return list.sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)));
    case 'name-asc':
      return list.sort((a, b) => String(a.name || a.patientName || '').localeCompare(String(b.name || b.patientName || '')));
    case 'confidence-desc':
      return list.sort((a, b) => (b.confidenceScore || 0) - (a.confidenceScore || 0));
    default:
      return list;
  }
}
