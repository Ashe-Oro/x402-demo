const store = new Map<string, { count: number; resetAt: number }>();

const MAX_DAILY_UNLOCKS = parseInt(process.env.MAX_DAILY_UNLOCKS || "50", 10);
const DAY_MS = 24 * 60 * 60 * 1000;

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = store.get(ip);

  if (!record || now > record.resetAt) {
    store.set(ip, { count: 1, resetAt: now + DAY_MS });
    return { allowed: true, remaining: MAX_DAILY_UNLOCKS - 1 };
  }

  if (record.count >= MAX_DAILY_UNLOCKS) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: MAX_DAILY_UNLOCKS - record.count };
}
