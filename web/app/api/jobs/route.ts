import { NextResponse } from 'next/server';
import { createJob, listJobs, validateJobInput } from '@/lib/jobsStore';
import { isAuthorized } from '@/lib/auth';
import type { Job } from '@/lib/types';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const jobs = await listJobs();
    return NextResponse.json(jobs);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to load jobs' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await req.json();
    const parsed = validateJobInput(body);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const now = new Date().toISOString();
    const id = globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2);
    const job: Job = {
      id,
      postedAt: parsed.value.postedAt ?? now,
      ...parsed.value,
    } as Job;

    const created = await createJob(job);
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
}
