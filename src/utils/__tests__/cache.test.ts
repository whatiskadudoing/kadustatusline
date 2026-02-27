import { describe, it, expect, afterEach } from "vitest";
import { FileCache } from "../cache.ts";
import { unlinkSync, existsSync } from "node:fs";

const TEST_KEY = "test-vitest-cache";

afterEach(() => {
  try {
    unlinkSync(`/tmp/ccstatus-${TEST_KEY}`);
  } catch {
    // ignore
  }
});

describe("FileCache", () => {
  it("calls fetch on cache miss and returns value", async () => {
    const cache = new FileCache();
    let fetched = false;
    const result = await cache.get({
      key: TEST_KEY,
      ttlSeconds: 60,
      fetch: async () => {
        fetched = true;
        return { hello: "world" };
      },
    });
    expect(fetched).toBe(true);
    expect(result).toEqual({ hello: "world" });
  });

  it("returns cached value on subsequent call", async () => {
    const cache = new FileCache();
    let fetchCount = 0;
    const opts = {
      key: TEST_KEY,
      ttlSeconds: 60,
      fetch: async () => {
        fetchCount++;
        return { count: fetchCount };
      },
    };
    await cache.get(opts);
    const second = await cache.get(opts);
    expect(fetchCount).toBe(1);
    expect(second).toEqual({ count: 1 });
  });

  it("invalidate removes cached entry", async () => {
    const cache = new FileCache();
    await cache.get({
      key: TEST_KEY,
      ttlSeconds: 60,
      fetch: async () => "cached",
    });
    expect(existsSync(`/tmp/ccstatus-${TEST_KEY}`)).toBe(true);
    cache.invalidate(TEST_KEY);
    expect(existsSync(`/tmp/ccstatus-${TEST_KEY}`)).toBe(false);
  });
});
