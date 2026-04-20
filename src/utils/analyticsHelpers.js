const groupCount = (items, key) => Object.entries(items.reduce((acc, item) => {
  const k = item[key] || 'Unknown';
  acc[k] = (acc[k] || 0) + 1;
  return acc;
}, {})).map(([name, value]) => ({ name, value }));

export const riskDistribution = (reports) => groupCount(reports, 'riskLevel');
export const diagnosisDistribution = (reports) => groupCount(reports, 'eyeCondition');
export const moduleUsage = (scans) => groupCount(scans, 'moduleUsed').sort((a, b) => b.value - a.value).slice(0, 10);
export const eyeDeviceUsage = (scans) => groupCount(scans, 'eyeDevice');
export const scanTypeDistribution = (scans) => groupCount(scans, 'scanType');

export function monthlyScanVolume(scans) {
  const map = scans.reduce((acc, s) => {
    const month = s.analysisDate.slice(0, 7);
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(map).sort((a, b) => a[0].localeCompare(b[0])).map(([name, scans]) => ({ name, scans }));
}

export function confidenceRange(reports) {
  const ranges = [
    { name: '60-69', min: 60, max: 69 },
    { name: '70-79', min: 70, max: 79 },
    { name: '80-89', min: 80, max: 89 },
    { name: '90-99', min: 90, max: 99 },
  ];
  return ranges.map((r) => ({ name: r.name, value: reports.filter((x) => x.confidenceScore >= r.min && x.confidenceScore <= r.max).length }));
}

export function ageGroups(patients) {
  const bins = [
    { name: '<18', fn: (a) => a < 18 },
    { name: '18-35', fn: (a) => a >= 18 && a <= 35 },
    { name: '36-50', fn: (a) => a >= 36 && a <= 50 },
    { name: '>50', fn: (a) => a > 50 },
  ];
  return bins.map((b) => ({ name: b.name, value: patients.filter((p) => b.fn(p.age)).length }));
}
