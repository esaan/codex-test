export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  category: string;
  storyType: string;
  tags: string[];
  author: string;
  publishedAt: string;
  readTime: number;
  featured?: boolean;
  link: string;
}
