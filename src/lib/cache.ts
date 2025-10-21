/**
 * Generic file-based cache utility
 * Can be used by any service to cache data to disk
 */

import fs from "fs";
import path from "path";

export interface CacheOptions {
  /**
   * Cache directory path (relative to project root)
   */
  dir: string;

  /**
   * Whether caching is enabled (default: true)
   */
  enabled?: boolean;
}

/**
 * Generic file-based cache with type safety
 *
 * @example
 * ```typescript
 * const cache = new FileCache<User>({ dir: '.cache/users' })
 *
 * // Get from cache or compute
 * const user = await cache.getOrCompute('user-123', async () => {
 *   return await fetchUserFromAPI('123')
 * })
 * ```
 */
export class FileCache<T> {
  private dir: string;
  private enabled: boolean;

  constructor(options: CacheOptions) {
    this.dir = path.join(process.cwd(), options.dir);
    // Cache is disabled by default, enable with CACHE=1
    this.enabled = process.env.CACHE === '1' ? true : (options.enabled ?? false);
  }

  /**
   * Ensure cache directory exists
   */
  private ensureDir(): void {
    if (!this.enabled) return;

    if (!fs.existsSync(this.dir)) {
      fs.mkdirSync(this.dir, { recursive: true });
    }
  }

  /**
   * Get file path for a cache key
   */
  private getFilePath(key: string): string {
    return path.join(this.dir, `${key}.json`);
  }

  /**
   * Get value from cache
   * Returns null if not found or cache disabled
   */
  get(key: string): T | null {
    if (!this.enabled) return null;

    try {
      const filePath = this.getFilePath(key);
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, "utf-8");
        return JSON.parse(data) as T;
      }
    } catch (error) {
      // Cache read failed, return null
    }

    return null;
  }

  /**
   * Set value in cache
   */
  set(key: string, value: T): void {
    if (!this.enabled) return;

    try {
      this.ensureDir();
      const filePath = this.getFilePath(key);
      fs.writeFileSync(filePath, JSON.stringify(value, null, 2), "utf-8");
    } catch (error) {
      // Cache write failed, not critical
      console.warn(`Failed to write cache for key "${key}":`, error);
    }
  }

  /**
   * Get from cache, or compute and cache the value
   * This is the main method you'll use most of the time
   *
   * @param key - Cache key
   * @param compute - Function to compute value if not cached
   * @returns Cached or computed value
   */
  async getOrCompute(key: string, compute: () => Promise<T>): Promise<T> {
    // Try to get from cache
    const cached = this.get(key);
    if (cached !== null) {
      return cached;
    }

    // Compute value
    const value = await compute();

    // Cache for next time
    this.set(key, value);

    return value;
  }

  /**
   * Delete a specific cache entry
   */
  delete(key: string): void {
    if (!this.enabled) return;

    try {
      const filePath = this.getFilePath(key);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.warn(`Failed to delete cache for key "${key}":`, error);
    }
  }

  /**
   * Clear all cache entries in this cache's directory
   */
  clear(): void {
    if (!this.enabled) return;

    try {
      if (fs.existsSync(this.dir)) {
        const files = fs.readdirSync(this.dir);
        for (const file of files) {
          if (file.endsWith(".json")) {
            fs.unlinkSync(path.join(this.dir, file));
          }
        }
      }
    } catch (error) {
      console.warn("Failed to clear cache:", error);
    }
  }

  /**
   * Check if cache has a key
   */
  has(key: string): boolean {
    if (!this.enabled) return false;

    const filePath = this.getFilePath(key);
    return fs.existsSync(filePath);
  }
}
