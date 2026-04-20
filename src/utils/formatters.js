export const formatDate = (date) => new Date(date).toLocaleDateString('id-ID');
export const formatPercent = (value) => `${Math.max(0, Math.min(100, Math.round(value)))}%`;
