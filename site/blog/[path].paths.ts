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

    // Add Open Graph and Twitter Card meta tags
    const title = pageData.params?.title || pageData.title
    const description = pageData.frontmatter?.description || `Blog post by Yunfei He`
    const url = `https://hyf.me/blog/${pageData.params?.path || ''}`
    const image = pageData.frontmatter?.image || 'https://hyf.me/og-image.png'

    pageData.frontmatter.head = [
      // Open Graph
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { property: 'og:type', content: 'article' }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { property: 'og:image', content: image }],

      // Twitter Card
      ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
      ['meta', { name: 'twitter:title', content: title }],
      ['meta', { name: 'twitter:description', content: description }],
      ['meta', { name: 'twitter:image', content: image }],
      ['meta', { name: 'twitter:site', content: '@_hyf0' }],
      ['meta', { name: 'twitter:creator', content: '@_hyf0' }],

      // Article metadata
      ['meta', { property: 'article:published_time', content: pageData.params?.date || '' }],
      ['meta', { property: 'article:author', content: 'Yunfei He' }],
    ]
  },
});
