export function hashString(input = '') {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function createSeed(input) {
  if (typeof input === 'number') return input >>> 0;
  return hashString(typeof input === 'string' ? input : JSON.stringify(input));
}

export function seededRandom(seed) {
  let state = createSeed(seed) || 1;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

export function seededPick(list = [], seed, count = 1) {
  const random = seededRandom(seed);
  const pool = [...list];
  const result = [];
  while (pool.length && result.length < count) {
    const idx = Math.floor(random() * pool.length);
    result.push(pool.splice(idx, 1)[0]);
  }
  return result;
}

export function normalizeToPercent(score, min = 0, max = 100) {
  if (max <= min) return 0;
  const clipped = Math.max(min, Math.min(max, score));
  return Math.round(((clipped - min) / (max - min)) * 100);
}
