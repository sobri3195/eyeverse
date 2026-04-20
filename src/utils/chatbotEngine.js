import { chatbotIntents } from '../data/aiKnowledge';

export function chatbotEngine(message, history = []) {
  const lower = message.toLowerCase();
  const contextTail = history.slice(-4).map((h) => h.text.toLowerCase()).join(' ');
  const scored = chatbotIntents.map((intent) => {
    const hits = intent.keywords.reduce((acc, key) => acc + (lower.includes(key) ? 2 : 0) + (contextTail.includes(key) ? 1 : 0), 0);
    return { ...intent, score: hits + (lower.includes(intent.intent) ? 1 : 0) };
  }).sort((a, b) => b.score - a.score);

  const top = scored[0];
  if (!top || top.score <= 0) {
    return {
      text: 'Saya belum menemukan konteks spesifik. Coba sebutkan gejala, jenis scan, atau nama modul AI mata.',
      suggestions: ['Apa gejala glaukoma?', 'Alat untuk skrining retina', 'Interpretasi confidence score'],
      intent: 'fallback',
    };
  }

  return {
    text: `${top.response} Fokus saat ini: ${top.intent.replace('_', ' ')}.`,
    suggestions: top.suggestions,
    intent: top.intent,
  };
}
