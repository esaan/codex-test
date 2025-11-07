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

