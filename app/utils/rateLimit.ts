// Simple in-memory rate limiter
// 2 requests per 60 seconds per IP

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

const RATE_LIMIT_WINDOW = 60 * 1000; // 60 seconds
const MAX_REQUESTS = 2;

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

export function checkRateLimit(ip: string): {
  allowed: boolean;
  remaining: number;
  resetIn: number;
} {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  // If no entry exists or window has expired, create new entry
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return {
      allowed: true,
      remaining: MAX_REQUESTS - 1,
      resetIn: RATE_LIMIT_WINDOW,
    };
  }

  // Check if limit exceeded
  if (entry.count >= MAX_REQUESTS) {
    const resetIn = entry.resetTime - now;
    return { allowed: false, remaining: 0, resetIn };
  }

  // Increment count
  entry.count += 1;
  rateLimitMap.set(ip, entry);

  return {
    allowed: true,
    remaining: MAX_REQUESTS - entry.count,
    resetIn: entry.resetTime - now,
  };
}

export function getRateLimitResponse(resetIn: number) {
  return {
    error:
      "Rate limit exceeded! You can only make 2 requests per 60 seconds. Please wait and try again.",
    resetIn: Math.ceil(resetIn / 1000),
  };
}
