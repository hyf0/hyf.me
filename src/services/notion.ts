/**
 * Notion service
 * Provides API client and data parsing utilities for Notion
 */

import { NotionAPI } from "notion-client";
import { type ExtendedRecordMap, type Decoration } from "notion-types";
import { getPageProperty, getTextContent } from "notion-utils";
import { FileCache } from "../lib/cache";
import { RawPageProps } from "../types/raw-page-props";
import { PageProps } from "@/types/page-props";

// Initialize Notion client
const notion = new NotionAPI();

// Initialize cache instances
const pageCache = new FileCache<ExtendedRecordMap>({
  dir: ".cache/posts",
});

const dbCache = new FileCache<ExtendedRecordMap>({
  dir: ".cache",
});


export async function getPage(pageId: string): Promise<ExtendedRecordMap> {
  return pageCache.getOrCompute(pageId, () => notion.getPage(pageId));
}

export async function getDbPage(
  databaseId: string,
): Promise<ExtendedRecordMap> {
  return dbCache.getOrCompute("notion-db", () => notion.getPage(databaseId));
}


export function extractSubPageIdsFromDbPage(recordMap: ExtendedRecordMap): string[] {
  const collection = Object.values(recordMap.collection)[0]?.value;
  const collectionView = Object.values(recordMap.collection_view)[0]?.value;
  const collectionQuery = recordMap.collection_query;

  if (!collection || !collectionView || !collectionQuery) {
    return [];
  }

  const collectionId = collection.id;
  const viewIds = Object.keys(
    collectionView ? { [collectionView.id]: true } : {},
  );

  let pageIds: string[] = [];

  if (viewIds.length > 0) {
    const viewId = viewIds[0];
    const queryResults = collectionQuery[collectionId]?.[viewId];

    if (queryResults) {
      // Try collection_group_results first (newer format)
      if (queryResults.collection_group_results) {
        const blockIds = queryResults.collection_group_results.blockIds;
        if (blockIds) {
          pageIds = blockIds;
        }
      }
      // Fallback to blockIds (older format)
      else if (queryResults.blockIds) {
        pageIds = queryResults.blockIds;
      }
    }
  }

  return pageIds;
}

export function mapPageIdToPageProps(
  pageIds: string[],
  recordMap: ExtendedRecordMap,
): PageProps[] {
  const rawProps = pageIds.map((pageId) => extractPageProps(pageId, recordMap));

  // Filter and map to PageProps
  return rawProps
    .filter((props) => {
      if (props.title == null || props.path == null || props.date == null || props.status == null) {

        if (props.status !== 'draft') {
          console.warn(`Page ${props.title}(${props.pageId}) is ignored due to missing required properties and not marked as draft. Props: ${JSON.stringify(props, null, 2)}`);
        }

        return false;
      }

      // Filter out drafts - only include published or posts without status
      if (props.status === 'draft') {
        return false;
      }

      return true;
    })
    .map((props): PageProps => ({
      pageId: props.pageId,
      title: props.title!,
      date: props.date!,
      path: props.path!,
      status: props.status || 'published', // Default to 'published' if not set
    }));
};

export function extractPageProps(
  pageId: string,
  recordMap: ExtendedRecordMap,
): RawPageProps {
  const pageBlock = recordMap.block[pageId]?.value;

  if (!pageBlock) {
    throw new Error(`Page ${pageId} not found in recordMap`);
  }

  // Extract title
  const titleProperty = getPageProperty<Decoration[] | undefined>(
    "title",
    pageBlock,
    recordMap,
  );
  let title: string | undefined;
  if (titleProperty) {
    const text = getTextContent(titleProperty);
    if (text) {
      title = text;
    }
  }

  // Extract path
  const slugProperty = getPageProperty<Decoration[] | undefined>(
    "path",
    pageBlock,
    recordMap,
  );
  let path: string | undefined;
  if (slugProperty) {
    const text = getTextContent(slugProperty);
    if (text) {
      path = text;
    }
  }

  // Extract date
  let date: number | undefined;
  const dateProperty = getPageProperty("date", pageBlock, recordMap);
  if (typeof dateProperty === 'number') {
    date = dateProperty;
  }

  // Extract status
  let status: 'published' | 'draft' | undefined;
  const statusProperty = getPageProperty<'published' | 'draft'>('status', pageBlock, recordMap);
  if (statusProperty) {
    if (statusProperty === 'published' || statusProperty === 'draft') {
      status = statusProperty;
    } else {
      console.warn(`Invalid status value "${statusProperty}" for page ${title}(${pageId}). Expected 'published' or 'draft'.`);
    }
  } 

  return {
    pageId: pageId,
    title,
    path,
    date,
    status,
  };
}
