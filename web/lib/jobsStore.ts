import { promises as fs } from 'fs';
import path from 'path';
import type { Job } from './types';

const DATA_PATH = path.join(process.cwd(), 'data', 'jobs.json');

async function readFile(): Promise<Job[]> {
  const buf = await fs.readFile(DATA_PATH, 'utf8');
  return JSON.parse(buf) as Job[];
}

async function writeFile(jobs: Job[]): Promise<void> {
  const body = JSON.stringify(jobs, null, 2) + '\n';
  await fs.writeFile(DATA_PATH, body, 'utf8');
}

export async function listJobs(): Promise<Job[]> {
  return readFile();
}

export async function getJob(id: string): Promise<Job | undefined> {
  const jobs = await readFile();
  return jobs.find((j) => j.id === id);
}

export async function createJob(job: Job): Promise<Job> {
  const jobs = await readFile();
  jobs.unshift(job);
  await writeFile(jobs);
  return job;
}

export async function updateJob(id: string, patch: Partial<Job>): Promise<Job | undefined> {
  const jobs = await readFile();
  const idx = jobs.findIndex((j) => j.id === id);
  if (idx === -1) return undefined;
  const updated: Job = { ...jobs[idx], ...patch, id: jobs[idx].id };
  jobs[idx] = updated;
  await writeFile(jobs);
  return updated;
}

export async function deleteJob(id: string): Promise<boolean> {
  const jobs = await readFile();
  const next = jobs.filter((j) => j.id !== id);
  if (next.length === jobs.length) return false;
  await writeFile(next);
  return true;
}

export function validateJobInput(input: any):
  | { ok: true; value: Omit<Job, 'id' | 'postedAt'> & Partial<Pick<Job, 'postedAt'>> }
  | { ok: false; error: string } {
  if (!input || typeof input !== 'object') return { ok: false, error: 'Invalid body' };
  const required = ['title', 'company', 'location', 'remote', 'type', 'url'];
  for (const k of required) {
    if (!input[k] || typeof input[k] !== 'string') {
      return { ok: false, error: `Missing or invalid '${k}'` };
    }
  }
  const remotes = ['Remote', 'Hybrid', 'Onsite'];
  const types = ['Full-time', 'Contract', 'Part-time', 'Internship'];
  if (!remotes.includes(input.remote)) return { ok: false, error: 'Invalid remote value' };
  if (!types.includes(input.type)) return { ok: false, error: 'Invalid type value' };

  // Validate URL
  try {
    const u = new URL(input.url);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') {
      return { ok: false, error: 'URL must be http(s)' };
    }
  } catch {
    return { ok: false, error: 'Invalid URL' };
  }

  // Validate tags: optional but if provided must be 2-32 chars, at most 10 tags
  const tags: string[] = Array.isArray(input.tags)
    ? input.tags.filter((t: any) => typeof t === 'string')
    : [];
  if (tags.length > 10) return { ok: false, error: 'Too many tags (max 10)' };
  if (tags.some((t) => t.length < 2 || t.length > 32)) {
    return { ok: false, error: 'Invalid tag(s): length must be 2-32' };
  }

  const description = typeof input.description === 'string' ? input.description : undefined;
  const postedAt = input.postedAt && typeof input.postedAt === 'string' ? input.postedAt : undefined;

  return {
    ok: true,
    value: {
      title: input.title,
      company: input.company,
      location: input.location,
      remote: input.remote,
      type: input.type,
      url: input.url,
      tags,
      description,
      postedAt,
    },
  };
}
