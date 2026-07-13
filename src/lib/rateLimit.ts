import { NextResponse } from "next/server";

interface RateLimitData {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitData>();

const LIMIT = 10; // Max 10 messages
const WINDOW_MS = 60 * 1000; // per 1 minute

export function rateLimit(ip: string): { success: boolean; limit: number; remaining: number; reset: number } {
  const now = Date.now();
  
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + WINDOW_MS,
    });
    return {
      success: true,
      limit: LIMIT,
      remaining: LIMIT - 1,
      reset: WINDOW_MS,
    };
  }

  const data = rateLimitMap.get(ip)!;

  // Window expired, reset
  if (now > data.resetTime) {
    data.count = 1;
    data.resetTime = now + WINDOW_MS;
    return {
      success: true,
      limit: LIMIT,
      remaining: LIMIT - 1,
      reset: WINDOW_MS,
    };
  }

  // Under limit
  if (data.count < LIMIT) {
    data.count += 1;
    const remaining = LIMIT - data.count;
    return {
      success: true,
      limit: LIMIT,
      remaining: remaining,
      reset: Math.max(0, data.resetTime - now),
    };
  }

  // Over limit
  return {
    success: false,
    limit: LIMIT,
    remaining: 0,
    reset: Math.max(0, data.resetTime - now),
  };
}
