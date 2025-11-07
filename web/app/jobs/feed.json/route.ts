import { NextResponse } from 'next/server';
import { listJobs } from '@/lib/jobsStore';

export const runtime = 'nodejs';

export async function GET() {
  const jobs = await listJobs();
  const items = [...jobs].sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
  return NextResponse.json({ items });
}

