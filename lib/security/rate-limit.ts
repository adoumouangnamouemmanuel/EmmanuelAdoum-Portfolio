import { NextResponse } from "next/server";

type RateLimitConfig = {
  key: string;
  windowMs: number;
  maxRequests: number;
  message?: string;
};

type RateLimitStore = Map<string, number[]>;

declare global {
  // eslint-disable-next-line no-var
  var __rateLimitStore__: RateLimitStore | undefined;
}

const rateLimitStore: RateLimitStore =
  globalThis.__rateLimitStore__ ?? new Map();

if (!globalThis.__rateLimitStore__) {
  globalThis.__rateLimitStore__ = rateLimitStore;
}

const getClientIp = (request: Request): string => {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  return "unknown";
};

export const enforceRateLimit = (
  request: Request,
  config: RateLimitConfig,
): NextResponse | null => {
  const now = Date.now();
  const ip = getClientIp(request);
  const bucketKey = `${config.key}:${ip}`;

  const previousHits = rateLimitStore.get(bucketKey) ?? [];
  const validHits = previousHits.filter(
    (timestamp) => now - timestamp < config.windowMs,
  );

  if (validHits.length >= config.maxRequests) {
    const oldestTimestamp = validHits[0] ?? now;
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((config.windowMs - (now - oldestTimestamp)) / 1000),
    );

    return NextResponse.json(
      {
        error: config.message || "Too many requests. Please try again later.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfterSeconds),
          "X-RateLimit-Limit": String(config.maxRequests),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(
            Math.ceil((oldestTimestamp + config.windowMs) / 1000),
          ),
        },
      },
    );
  }

  validHits.push(now);
  rateLimitStore.set(bucketKey, validHits);

  return null;
};
