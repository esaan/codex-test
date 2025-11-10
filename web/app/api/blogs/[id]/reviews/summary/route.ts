import { NextResponse, NextRequest } from 'next/server';
import { getRatingSummary } from '@/lib/reviewsStore';
import { getBlog } from '@/lib/blogsStore';

export const runtime = 'nodejs';

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> } | { params: { id: string } }
) {
  const rawParams: any = (context as any).params;
  const { id } = typeof rawParams?.then === 'function' ? await rawParams : rawParams;
  const blog = await getBlog(id);
  if (!blog) return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
  const { average, count } = await getRatingSummary(id);
  return NextResponse.json({ average, count });
}
