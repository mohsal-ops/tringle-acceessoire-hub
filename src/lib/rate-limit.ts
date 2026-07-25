import { getRequest } from "@tanstack/react-start/server";

// --- Lightweight in-memory rate limiter -------------------------------------
// Per-IP sliding window. State is per server instance, so on a horizontally
// scaled / serverless deploy this is best-effort, not a global guarantee. It
// still blunts the common case (one bot hammering one endpoint from one IP).
// For a hard global limit, back this with a Supabase table or edge KV store.
//
// Only ever imported inside server-fn handlers.

const buckets = new Map<string, Map<string, number[]>>();

export function clientIp(): string {
  try {
    const req = getRequest();
    const h = req?.headers;
    if (!h) return "unknown";
    const fwd = h.get("x-forwarded-for");
    if (fwd) return fwd.split(",")[0]!.trim();
    return h.get("x-real-ip") || h.get("cf-connecting-ip") || "unknown";
  } catch {
    return "unknown";
  }
}

/**
 * Throws a user-facing error when `ip` has exceeded `max` calls within
 * `windowMs` for the given `bucket` (e.g. "orders", "appointments").
 */
export function rateLimit(bucket: string, ip: string, max: number, windowMs = 60_000) {
  const now = Date.now();
  let store = buckets.get(bucket);
  if (!store) {
    store = new Map();
    buckets.set(bucket, store);
  }
  const hits = (store.get(ip) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= max) {
    throw new Error("Trop de requêtes. Réessayez dans un instant. / طلبات كثيرة، حاول بعد قليل.");
  }
  hits.push(now);
  store.set(ip, hits);
  if (store.size > 5000) {
    for (const [k, v] of store) {
      if (v.every((t) => now - t >= windowMs)) store.delete(k);
    }
  }
}
