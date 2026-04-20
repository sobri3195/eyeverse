import { riskCalculator } from './riskCalculator';
import { buildExplainability } from './explainabilityEngine';
import { buildRecommendations } from './recommendationEngine';
import { compareWithPrevious } from './monitoringEngine';
import { runImageInference } from './imageInferenceEngine';

export function simulateAnalysis({ patient, scanType, symptoms, aiModule, severityLevel = 'moderate', durationDays = 14, imageFile = null, previousExam = null, scanFindings = 'normal' }) {
  const input = {
    age: patient?.age || 45,
    gender: patient?.gender || 'N/A',
    medicalHistory: patient?.medicalHistory || [],
    symptoms: symptoms || [],
    durationDays,
    severityLevel,
    scanType,
    aiModule,
    scanFindings,
    corneaStatus: (patient?.eyeCondition || '').toLowerCase().includes('kornea') ? 'abnormal' : 'normal',
  };

  const core = riskCalculator(input);
  const explainability = buildExplainability(input, core, core.rules.reasons);
  const recommendation = buildRecommendations({ probableCondition: core.probableCondition, urgencyScore: core.urgencyScore, aiModule });
  const monitoring = compareWithPrevious(core, previousExam);
  const imageAnalysis = imageFile ? runImageInference({ file: imageFile, scanType, aiModule }) : null;

  return {
    ...core,
    ...recommendation,
    explainability,
    monitoring,
    imageAnalysis,
    urgency: core.urgencyScore >= 75 ? 'Perlu pemeriksaan lanjutan segera' : core.urgencyScore >= 50 ? 'Perlu evaluasi terjadwal' : 'Monitoring rutin',
    chart: [
      { name: 'Disease Prob.', value: core.diseaseProbability },
      { name: 'Confidence', value: core.confidence },
      { name: 'Severity', value: core.severityScore },
      { name: 'Urgency', value: core.urgencyScore },
      { name: 'Eye Health', value: core.eyeHealthScore },
    ],
    diagnosisResult: `${core.probableCondition} (${scanType})`,
    reportSummary: `${core.probableCondition} | Risk ${core.riskLevel} | Confidence ${core.confidence}% | Next: ${recommendation.nextAction}`,
  };
}
