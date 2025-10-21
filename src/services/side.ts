/**
 * Centralized data service
 * Fetches database once and provides all data needed for sidebar and blog pages
 * Uses in-memory caching to avoid duplicate fetches
 */

import type { SideData } from "../types/side-data";
import type { Post } from "../types/post";
import type { DefaultTheme } from "vitepress";
import { config } from "../config";
import {
  getDbPage,
  extractSubPageIdsFromDbPage,
  mapPageIdToPageProps,
} from "./notion";

// Module-level in-memory cache
// Persists for the entire build process
let cachedSideData: SideData | null = null;

/**
 * Get all side data (sidebar + posts)
 * Fetches from Notion once, then caches in memory for subsequent calls
 *
 * This is the single source of truth for all blog data during build
 */
export async function getSideData(): Promise<SideData> {
  // Return cached data if available
  if (cachedSideData) {
    return cachedSideData;
  }

    // Fetch database once
    const dbPage = await getDbPage(config.notionDatabasePageId);
    const subPageIds = extractSubPageIdsFromDbPage(dbPage);

    if (subPageIds.length === 0) {
      const emptyData: SideData = { sidebar: [], posts: [] };
      cachedSideData = emptyData;
      return emptyData;
    }

    const subPagePropsList = mapPageIdToPageProps(subPageIds, dbPage)



    // Extract metadata for all posts
    const posts: Post[] = subPagePropsList
      .map((props): Post | null => {
        try {
          return {
            pageId: props.pageId,
            title: props.title,
            slug: props.path,
            date: new Date(props.date).toISOString().split("T")[0],
            // Format should be MM-DD
            dateForSidebar: new Date(props.date)
              .toISOString()
              .split("T")[0]
              .slice(5),
            tags: [] as string[],
            description: "",
            url: `/blog/${props.path}`,
          };
        } catch (error) {
          return null;
        }
      })
      .filter((post): post is Post => post !== null)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Generate sidebar from posts
    const sidebar = generateSidebarFromPosts(posts);

    // Cache and return
    cachedSideData = { sidebar, posts };
    return cachedSideData;
  
}

/**
 * Generate sidebar navigation grouped by year
 * Returns VitePress DefaultTheme.SidebarItem[] format
 */
function generateSidebarFromPosts(
  posts: Post[],
): DefaultTheme.SidebarItem[] {
  // Extract all posts with their years
  const postsWithSidebarInfo = posts.map((post) => {
    // Re-extract properties to get original date for year grouping
    const date = new Date(post.date);

    return {
      title: post.title,
      link: post.url,
      year: date.getUTCFullYear(),
    };
  });

  // Group by year
  const groupedByYear = new Map<
    number,
    Array<{ title: string; link: string }>
  >();

  postsWithSidebarInfo.forEach((post) => {
    if (!groupedByYear.has(post.year)) {
      groupedByYear.set(post.year, []);
    }
    groupedByYear.get(post.year)!.push({
      title: post.title,
      link: post.link,
    });
  });

  // Convert to VitePress sidebar format
  // Each year is a collapsible group
  const sidebar: DefaultTheme.SidebarItem[] = Array.from(
    groupedByYear.entries(),
  )
    .sort((a, b) => b[0] - a[0]) // Sort years newest first
    .map(([year, yearPosts]) => ({
      text: year.toString(),
      items: yearPosts.map((post) => ({
        text: post.title,
        link: post.link,
      })),
    }));

  return sidebar;
}

