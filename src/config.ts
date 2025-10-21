/**
 * Notion configuration
 * Uses notion-client (unofficial API) for compatibility with react-notion-x
 */

import { config as dotenvConfig } from "dotenv";
import { WebsiteConfig } from "./types/website-config";

// Load environment variables from .env.local (quietly)
dotenvConfig({ path: ".env.local", debug: false });

export const config: WebsiteConfig = {
  notionDatabasePageId: process.env.NOTION_PAGE_ID || "",
};

if (!config.notionDatabasePageId) {
  throw new Error(
    "`NOTION_PAGE_ID` environment variable is required but not set.",
  );
}

