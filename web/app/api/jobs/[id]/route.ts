import { NextResponse } from 'next/server';
import { deleteJob, getJob, updateJob, validateJobInput } from '@/lib/jobsStore';
import { isAuthorized } from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const job = await getJob(params.id);
  if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(job);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  if (!isAuthorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const parsed = validateJobInput(body);
    if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
    const updated = await updateJob(params.id, parsed.value as any);
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  if (!isAuthorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    // Partial update: accept any subset; rely on store to merge but keep id constant
    const updated = await updateJob(params.id, body);
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  if (!isAuthorized(_req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const ok = await deleteJob(params.id);
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
