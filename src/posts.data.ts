/**
 * VitePress data loader for Notion posts
 * Fetches post metadata at build time for the blog list page
 */

import { defineLoader } from "vitepress";
import { getSideData } from "./services/side";
import type { Post } from "./types/post";

declare const data: Post[];
export { data };

/**
 * VitePress data loader with type safety
 * Uses centralized getSideData() to avoid duplicate fetches
 */
export default defineLoader({
  async load(): Promise<Post[]> {
    const sideData = await getSideData();
    return sideData.posts;
  },
});
