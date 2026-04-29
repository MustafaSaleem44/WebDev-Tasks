import { NextResponse } from "next/server";

const rateLimitMap = new Map();

export function applyRateLimit(identifier, limit, windowMs) {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record) {
    rateLimitMap.set(identifier, { count: 1, lastReset: now });
    return null; // Not limited
  }

  if (now - record.lastReset > windowMs) {
    // Reset window
    record.count = 1;
    record.lastReset = now;
    return null;
  }

  record.count += 1;

  if (record.count > limit) {
    return NextResponse.json(
      { error: "Too Many Requests. Please try again later." },
      { status: 429 }
    );
  }

  return null;
}
