import { reportTemplates } from '../data/aiKnowledge';

export function buildSmartReport({ patient, input, analysis, explainability, recommendations }) {
  return {
    id: `REP-${Date.now()}`,
    patient: {
      id: patient.id,
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
    },
    examType: input.scanType,
    aiModule: input.aiModule,
    symptoms: input.symptoms,
    analysis,
    explainability,
    recommendations,
    createdAt: new Date().toISOString(),
    createdBy: 'EYEVERSE AI System',
    footer: reportTemplates.footer,
  };
}
