export function compareWithPrevious(current, previous) {
  if (!previous) {
    return {
      monitoringStatus: 'Baseline',
      change: 'Belum ada data pembanding',
      confidenceDelta: 0,
      riskDelta: 0,
      trend: [{ exam: 'Current', confidence: current.confidence, risk: current.diseaseProbability }],
      followUpSuggestion: 'Lakukan pemeriksaan ulang untuk membangun tren',
    };
  }

  const confidenceDelta = current.confidence - previous.confidence;
  const riskDelta = current.diseaseProbability - previous.diseaseProbability;
  const monitoringStatus = riskDelta <= -8 ? 'Membaik' : riskDelta >= 8 ? 'Memburuk' : 'Stabil';

  return {
    monitoringStatus,
    change: `Risk ${riskDelta >= 0 ? '+' : ''}${riskDelta}, Confidence ${confidenceDelta >= 0 ? '+' : ''}${confidenceDelta}`,
    confidenceDelta,
    riskDelta,
    diagnosisShift: current.probableCondition === previous.probableCondition ? 'Diagnosis konsisten' : `${previous.probableCondition} -> ${current.probableCondition}`,
    trend: [
      { exam: 'Previous', confidence: previous.confidence, risk: previous.diseaseProbability },
      { exam: 'Current', confidence: current.confidence, risk: current.diseaseProbability },
    ],
    followUpSuggestion: monitoringStatus === 'Memburuk' ? 'Percepat follow-up dan pemeriksaan device lanjut' : 'Lanjutkan monitoring berkala',
  };
}
