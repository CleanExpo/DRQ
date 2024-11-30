export interface CacheEntry {
  key: string;
  data: any;
  expires: Date;
  type: 'service-area' | 'page-content' | 'meta' | 'sitemap';
  createdAt: Date;
  updatedAt: Date;
}
