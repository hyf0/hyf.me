/**
 * VitePress dynamic routes - generates paths at build time
 * https://vitepress.dev/guide/routing#dynamic-routes
 */
import { defineRoutes } from 'vitepress'
import { getSideData } from "../../src/services/side";
import { getPage } from "../../src/services/notion";
import { renderNotionToHTML } from "../../src/renderers/notion-renderer";

interface DynamicRoute {
  params: {
    path: string;
    title: string;
    date: string;
    htmlContent: string;
  };
  content: string;
}

export default defineRoutes({
  async paths() {
    // Get post metadata from centralized source
    // This uses cached data, no duplicate database fetch
    const sideData = await getSideData();

    if (sideData.posts.length === 0) {
      return [];
    }

    // Generate paths and content for each page
    const routes: DynamicRoute[] = [];

    for (const post of sideData.posts) {
      try {
        // Fetch full page content for rendering
        // This is the only place we fetch individual posts
        const pageRecordMap = await getPage(post.pageId);

        // Render to HTML
        const partHtml = renderNotionToHTML(pageRecordMap);

        routes.push({
          params: {
            path: post.slug,
            title: post.title,
            date: post.date,
            htmlContent: partHtml, // Store HTML in params
          },
          content: '', // Empty content since we'll use v-html
        });
      } catch (error) {
        // Silently skip failed pages
        console.error(`Failed to render post ${post.slug}:`, error);
        continue;
      }
    }

    return routes;
  },
  transformPageData(pageData, _ctx) {
    if (typeof pageData.params?.title === 'string') {
      pageData.title = pageData.params.title
    }
    // Inject HTML content into frontmatter so it can be accessed in template
    if (typeof pageData.params?.htmlContent === 'string') {
      pageData.frontmatter.htmlContent = pageData.params.htmlContent
    }
  },
});
