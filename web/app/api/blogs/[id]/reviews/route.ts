import { NextResponse, NextRequest } from 'next/server';
import { createReview, listReviews, validateReviewInput } from '@/lib/reviewsStore';
import { getBlog } from '@/lib/blogsStore';

export const runtime = 'nodejs';

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> } | { params: { id: string } }
) {
  const rawParams: any = (context as any).params;
  const { id } = typeof rawParams?.then === 'function' ? await rawParams : rawParams;
  // Ensure blog exists (avoid listing for non-existent)
  const blog = await getBlog(id);
  if (!blog) return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
  const items = await listReviews(id);
  return NextResponse.json(items);
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } | { params: { id: string } }
) {
  const rawParams: any = (context as any).params;
  const { id } = typeof rawParams?.then === 'function' ? await rawParams : rawParams;
  const blog = await getBlog(id);
  if (!blog) return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
  try {
    const body = await req.json();
    const parsed = validateReviewInput(body);
    if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
    const created = await createReview(id, parsed.value);
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
}
