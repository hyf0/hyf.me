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
 * Render a Notion page to static HTML string
 * @param recordMap - The Notion page data
 * @returns HTML string
 */
export function renderNotionToHTML(recordMap: ExtendedRecordMap): string {
  try {
    // Render the React component to HTML string
    const html = renderToStaticMarkup(
        <NotionRenderer
          recordMap={recordMap}
          fullPage={false}
          darkMode={false}
          // Disable components that require client-side JavaScript
          components={{
            // Collection and Tweet blocks are not supported (require client-side JS)
            Collection: () => null,
            Tweet: () => null,
            Code,
          }}
        />
    );

    return html;
  } catch (error) {
    console.error("Error rendering Notion page to HTML:", error);
    return "<p>Error rendering content</p>";
  }
}

