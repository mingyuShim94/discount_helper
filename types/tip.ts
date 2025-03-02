export interface ITip {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  publishedAt: string;
  updatedAt?: string;
  author?: string;
  tags?: string[];
}
