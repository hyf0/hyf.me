// Load environment variables from .env.local file
import "dotenv/config";

import { defineConfig, type UserConfig } from "vitepress";
import { getSideData } from "../src/services/side";

/**
 * VitePress configuration with full type safety
 * @see https://vitepress.dev/reference/site-config
 */
export default (async (): Promise<UserConfig> => {
  // Get all data from centralized source
  // This fetches from Notion once and caches in memory
  const sideData = await getSideData();

  return defineConfig({
    srcDir: "site",
    cleanUrls: true,
    head: process.env.NODE_ENV === "production" ? [
      [
        'script',
        { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-LTV8LRNKY1' }
      ],
      [
        'script',
        {},
        `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-LTV8LRNKY1');`
      ]
    ] : undefined,
    // Site metadata
    title: `Yunfei's Website`,
    description: "Yunfei He's personal website",

    // Theme configuration
    // @see https://vitepress.dev/reference/default-theme-config
    themeConfig: {
      nav: [
        { text: "Home", link: "/" },
        { text: "Blog", link: "/blog" },
      ],

      socialLinks: [
        { icon: "github", link: "https://github.com/hyf0" },
        { icon: "x", link: "https://x.com/_hyf0" },
      ],

      sidebar: {
        "/blog/": sideData.sidebar,
      },
      footer: {
        copyright: "CC BY-NC-SA 4.0 2025-PRESENT © Yunfei He"
      }
    },
  });
})();
