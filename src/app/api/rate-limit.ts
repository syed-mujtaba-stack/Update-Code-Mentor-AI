// Simple in-memory rate limiter for demo (per IP)
const rateLimitStore: Record<string, { count: number; last: number }> = {};
const WINDOW = 60 * 1000; // 1 minute
const LIMIT = 30; // 30 requests per minute

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  if (!rateLimitStore[ip] || now - rateLimitStore[ip].last > WINDOW) {
    rateLimitStore[ip] = { count: 1, last: now };
    return true;
  }
  if (rateLimitStore[ip].count < LIMIT) {
    rateLimitStore[ip].count++;
    return true;
  }
  return false;
}
