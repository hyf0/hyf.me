/**
 * Render Notion pages to HTML using react-notion-x
 * This runs at BUILD TIME ONLY - no React code ships to the browser
 * Output is pure static HTML
 */

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { NotionRenderer } from "react-notion-x";
import { type ExtendedRecordMap } from "notion-types";
import { Code } from 'react-notion-x/build/third-party/code'
import 'prismjs/components/prism-rust.js'

/**
 * Render a Notion page to static HTML string with both light and dark versions
 * This allows CSS-based dark mode switching without client-side JavaScript
 * @param recordMap - The Notion page data
 * @returns HTML string containing both light and dark mode versions
 */
export function renderNotionToHTML(recordMap: ExtendedRecordMap): string {
  try {
    const sharedProps = {
      recordMap,
      fullPage: false,
      // Disable components that require client-side JavaScript
      components: {
        // Collection and Tweet blocks are not supported (require client-side JS)
        Collection: () => null,
        Tweet: () => null,
        Code,
      }
    };

    // Render light mode version
    const lightHtml = renderToStaticMarkup(
        <NotionRenderer
          {...sharedProps}
          darkMode={false}
        />
    );

    // Render dark mode version
    const darkHtml = renderToStaticMarkup(
        <NotionRenderer
          {...sharedProps}
          darkMode={true}
        />
    );

    // Wrap each version in a container with Tailwind dark mode classes
    // Light version: visible by default, hidden in dark mode
    // Dark version: hidden by default, visible in dark mode
    return `<div class="notion-light-mode block dark:hidden">${lightHtml}</div><div class="notion-dark-mode hidden dark:block">${darkHtml}</div>`;
  } catch (error) {
    console.error("Error rendering Notion page to HTML:", error);
    return "<p>Error rendering content</p>";
  }
}

