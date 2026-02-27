import { readFileSync, writeFileSync, statSync, unlinkSync } from "node:fs";

/**
 * Options for a single cache entry lookup.
 */
export interface CacheOptions<T> {
  /** Unique cache key (used as filename suffix in /tmp). */
  key: string;
  /** Maximum age in seconds before the cached value is considered stale. */
  ttlSeconds: number;
  /** Async function that produces a fresh value on cache miss. */
  fetch: () => Promise<T>;
}

/**
 * Generic TTL-based file-backed cache stored in /tmp/kadusl-*.
 */
export class FileCache {
  private prefix = "/tmp/kadusl-";

  /**
   * Return cached value if fresh, otherwise call fetch() and persist the result.
   */
  async get<T>(opts: CacheOptions<T>): Promise<T> {
    const path = this.prefix + opts.key;

    try {
      const stat = statSync(path);
      const age = (Date.now() - stat.mtimeMs) / 1000;
      if (age < opts.ttlSeconds) {
        return JSON.parse(readFileSync(path, "utf-8")) as T;
      }
    } catch {
      // Cache miss — file does not exist or is unreadable.
    }

    const data = await opts.fetch();

    try {
      writeFileSync(path, JSON.stringify(data));
    } catch {
      // Non-fatal — we still have the data in memory.
    }

    return data;
  }

  /**
   * Remove a cached entry by key.
   */
  invalidate(key: string): void {
    try {
      unlinkSync(this.prefix + key);
    } catch {
      // Entry may not exist — that is fine.
    }
  }
}

/** Shared singleton cache instance. */
export const cache = new FileCache();
