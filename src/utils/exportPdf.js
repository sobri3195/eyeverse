import jsPDF from 'jspdf';

export function exportPdf(title, payload) {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(title, 14, 18);
  doc.setFontSize(11);

  const lines = Array.isArray(payload)
    ? payload.map((item) => (typeof item === 'string' ? item : JSON.stringify(item)))
    : Object.entries(payload || {}).map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`);

  lines.slice(0, 24).forEach((line, idx) => {
    doc.text(String(line).slice(0, 95), 14, 30 + idx * 7);
  });

  doc.save(`${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.pdf`);
}
