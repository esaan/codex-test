export type RemoteMode = 'Remote' | 'Hybrid' | 'Onsite';
export type JobType = 'Full-time' | 'Contract' | 'Part-time' | 'Internship';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  remote: RemoteMode;
  type: JobType;
  postedAt: string; // ISO date
  url: string;
  tags: string[];
  description?: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  publishedAt: string; // ISO date
  updatedAt?: string; // ISO date
  tags: string[];
  author?: string;
  excerpt?: string;
}

export interface Review {
  id: string;
  blogId: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  author?: string;
  createdAt: string; // ISO date
}
