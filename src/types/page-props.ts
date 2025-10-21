import { PageStatus } from "./page-status";

export interface PageProps {
  pageId: string;
  title: string;
  // Unix timestamp
  date: number;
  path: string;
  status: PageStatus;
}