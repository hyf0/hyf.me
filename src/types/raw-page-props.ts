import { PageStatus } from "./page-status";

export interface RawPageProps {
  pageId: string;
  title?: string;
  // Unix timestamp
  date?: number;
  path?: string;
  status?: PageStatus;
}