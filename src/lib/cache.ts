// In-Memory Cache for Next.js Serverless Functions
// Layer 2: Node.js Memory Cache (Free, ephemeral cache instance)

type CacheItem<T> = {
  data: T;
  expiry: number;
};

class InMemoryCache {
  private cache = new Map<string, CacheItem<any>>();

  set<T>(key: string, data: T, ttlSeconds: number = 60) {
    const expiry = Date.now() + ttlSeconds * 1000;
    this.cache.set(key, { data, expiry });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data as T;
  }

  invalidate(key: string) {
    this.cache.delete(key);
  }

  // To invalidate all caches for a specific user prefix
  invalidatePrefix(prefix: string) {
    for (const key of Array.from(this.cache.keys())) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
      }
    }
  }

  clear() {
    this.cache.clear();
  }
}

// Global singleton instance
export const appCache = new InMemoryCache();
