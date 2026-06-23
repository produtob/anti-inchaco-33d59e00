// Deduplicação simples in-memory (por instância serverless).
// Para garantia forte entre instâncias, plugar Redis/KV depois.
const TTL_MS = 24 * 60 * 60 * 1000; // 24h
const MAX = 5000;

const store = new Map<string, number>();

function sweep() {
  const now = Date.now();
  for (const [k, exp] of store) {
    if (exp < now) store.delete(k);
  }
  if (store.size > MAX) {
    const overflow = store.size - MAX;
    let i = 0;
    for (const k of store.keys()) {
      store.delete(k);
      if (++i >= overflow) break;
    }
  }
}

export function seenBefore(id: string): boolean {
  sweep();
  const now = Date.now();
  const exp = store.get(id);
  if (exp && exp > now) return true;
  store.set(id, now + TTL_MS);
  return false;
}

export function dedupStats() {
  sweep();
  return { size: store.size, ttlMs: TTL_MS, max: MAX };
}
