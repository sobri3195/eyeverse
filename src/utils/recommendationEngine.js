import { recommendationRules, technologyRelations } from '../data/aiKnowledge';

export function buildRecommendations({ probableCondition, urgencyScore, aiModule }) {
  const actions = recommendationRules
    .filter((x) => x.condition === probableCondition)
    .sort((a, b) => (a.priority < b.priority ? 1 : -1))
    .slice(0, 4)
    .map((x) => x.action);

  const tech = technologyRelations.find((x) => x.moduleName === aiModule);
  const triagePriority = urgencyScore >= 80 ? 'Critical' : urgencyScore >= 60 ? 'High' : urgencyScore >= 40 ? 'Medium' : 'Low';

  return {
    recommendations: actions.length ? actions : ['Monitoring 30 hari', 'Evaluasi klinis tambahan'],
    followUp: triagePriority === 'Critical' ? 'Rujuk segera ke oftalmologi' : triagePriority === 'High' ? 'Kontrol 7-14 hari' : 'Kontrol 30 hari',
    relatedTechnologies: tech?.relatedDevices || [],
    deviceCompatibility: tech?.compatibleScans || [],
    triagePriority,
    nextAction: actions[0] || 'Lakukan pemeriksaan lanjutan',
  };
}
