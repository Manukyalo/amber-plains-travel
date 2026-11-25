/**
 * Public-only versioned cache backed by Upstash/Redis REST when configured,
 * with a bounded in-memory fallback for local/serverless execution.
 *
 * SECURITY RULE:
 * Never store PII, payment data, private supplier rates, or user-specific
 * booking responses in this shared public cache.
 */

export type PublicCacheNamespace =
  | "destinations"
  | "experiences"
  | "packages"
  | "gallery"
  | "testimonials"
  | "journal"
  | "site_settings";

const ALLOWED_NAMESPACES: ReadonlySet<PublicCacheNamespace> = new Set([
  "destinations",
  "experiences",
  "packages",
  "gallery",
  "testimonials",
  "journal",
  "site_settings",
]);

const DEFAULT_TTL_SECONDS = 300;
const memoryStore = new Map<string, { value: string; expiresAt: number }>();
const namespaceVersions = new Map<PublicCacheNamespace, number>();

function getVersion(namespace: PublicCacheNamespace): number {
  return namespaceVersions.get(namespace) ?? 1;
}

function buildKey(namespace: PublicCacheNamespace, key: string): string {
  if (!ALLOWED_NAMESPACES.has(namespace)) {
    throw new Error(`CACHE_POLICY_VIOLATION: Namespace '${namespace}' is not permitted in public cache.`);
  }
  return `ap:pub:v${getVersion(namespace)}:${namespace}:${key}`;
}

async function redisFetch(commandPath: string): Promise<unknown | null> {
  const url = process.env.REDIS_REST_URL;
  const token = process.env.REDIS_REST_TOKEN;
  if (!url || !token) return null;

  const res = await fetch(`${url.replace(/\/$/, "")}/${commandPath}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { result?: unknown };
  return data.result ?? null;
}

export async function getPublicCached<T>(
  namespace: PublicCacheNamespace,
  key: string,
  loader: () => Promise<T>,
  ttlSeconds: number = DEFAULT_TTL_SECONDS
): Promise<{ data: T; cacheHit: boolean }> {
  const cacheKey = buildKey(namespace, key);

  // 1. Try Redis REST if configured
  const redisRaw = await redisFetch(`get/${encodeURIComponent(cacheKey)}`);
  if (typeof redisRaw === "string") {
    return { data: JSON.parse(redisRaw) as T, cacheHit: true };
  }

  // 2. Fallback to bounded in-memory cache
  const memEntry = memoryStore.get(cacheKey);
  if (memEntry && memEntry.expiresAt > Date.now()) {
    return { data: JSON.parse(memEntry.value) as T, cacheHit: true };
  }

  // 3. Load from authoritative source and populate cache
  const fresh = await loader();
  const serialized = JSON.stringify(fresh);

  memoryStore.set(cacheKey, {
    value: serialized,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });

  if (process.env.REDIS_REST_URL && process.env.REDIS_REST_TOKEN) {
    await redisFetch(
      `set/${encodeURIComponent(cacheKey)}/${encodeURIComponent(serialized)}?EX=${ttlSeconds}`
    );
  }

  return { data: fresh, cacheHit: false };
}

/**
 * Version-bumps a public namespace when packages, gallery assets,
 * public settings, or approved public content changes.
 */
export async function invalidatePublicCache(namespace: PublicCacheNamespace): Promise<number> {
  const nextVersion = getVersion(namespace) + 1;
  namespaceVersions.set(namespace, nextVersion);

  const prefix = `ap:pub:v${nextVersion - 1}:${namespace}:`;
  for (const k of memoryStore.keys()) {
    if (k.startsWith(prefix)) {
      memoryStore.delete(k);
    }
  }

  return nextVersion;
}
