import { NextResponse, NextRequest } from 'next/server';
import { deleteReview, getReview } from '@/lib/reviewsStore';
import { isAuthorized } from '@/lib/auth';

export const runtime = 'nodejs';

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string; reviewId: string }> } | { params: { id: string; reviewId: string } }
) {
  if (!isAuthorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const rawParams: any = (context as any).params;
  const { id, reviewId } = typeof rawParams?.then === 'function' ? await rawParams : rawParams;
  const exists = await getReview(id, reviewId);
  if (!exists) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const ok = await deleteReview(id, reviewId);
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
