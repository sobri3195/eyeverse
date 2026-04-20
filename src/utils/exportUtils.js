import jsPDF from 'jspdf';

export const exportToCsv = (filename, rows) => {
  const headers = Object.keys(rows[0] || {});
  const csv = [headers.join(','), ...rows.map((row) => headers.map((h) => JSON.stringify(row[h] ?? '')).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `${filename}.csv`);
  link.click();
};

export const exportToPdf = (title, lines) => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text(title, 14, 20);
  doc.setFontSize(11);
  lines.forEach((line, idx) => doc.text(line, 14, 35 + idx * 8));
  doc.save(`${title.replace(/\s+/g, '-').toLowerCase()}.pdf`);
};
