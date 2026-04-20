export function chatbotEngine(message, knowledge) {
  const lower = message.toLowerCase();
  const match = knowledge.find((k) => lower.includes(k.keyword.toLowerCase()));
  if (match) return `${match.response} Saran: ${match.suggestion}`;
  return 'Maaf, saya belum menemukan jawaban spesifik. Coba kata kunci: katarak, glaukoma, OCT, fundus.';
}
