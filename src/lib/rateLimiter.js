// A simple, fast in-memory rate limiter for Next.js APIs.
const cache = new Map();

export function rateLimit(ip, limit = 5, windowMs = 60000) {
  const now = Date.now();
  const record = cache.get(ip) || { count: 0, startTime: now };

  // Reset window if it has passed
  if (now - record.startTime > windowMs) {
    record.count = 0;
    record.startTime = now;
  }

  record.count++;
  cache.set(ip, record);

  // Clean up cache periodically (prevent memory leaks)
  if (cache.size > 1000) {
    const expiredThresh = now - windowMs;
    for (const [key, value] of cache.entries()) {
      if (value.startTime < expiredThresh) {
        cache.delete(key);
      }
    }
  }

  const isRateLimited = record.count > limit;
  return {
    success: !isRateLimited,
    remaining: Math.max(0, limit - record.count),
    resetTime: record.startTime + windowMs
  };
}
