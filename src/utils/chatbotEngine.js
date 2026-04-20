import { chatbotRules } from '../data/chatbotRules';

export function chatbotEngine(message) {
  const text = message.toLowerCase();
  const rule = chatbotRules.find((r) => r.keywords.some((k) => text.includes(k)));
  if (rule) return rule.response;
  return 'Terima kasih. Jelaskan gejala (mis. buram, nyeri, merah) agar saya bisa memberi saran awal pemeriksaan mata.';
}
