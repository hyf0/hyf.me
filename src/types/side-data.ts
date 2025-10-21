/**
 * Centralized side data type
 * Contains all data needed for sidebar and blog pages
 */

import type { DefaultTheme } from "vitepress";
import type { Post } from "./post";

export interface SideData {
  /**
   * Ready-to-use sidebar configuration for VitePress
   * Can be directly assigned to themeConfig.sidebar
   */
  sidebar: DefaultTheme.SidebarItem[];

  /**
   * Ready-to-use post list with metadata
   * Sorted by date (newest first)
   */
  posts: Post[];
}
