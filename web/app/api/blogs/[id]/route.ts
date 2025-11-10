import { NextResponse, NextRequest } from 'next/server';
import { deleteBlog, getBlog, updateBlog, validateBlogInput } from '@/lib/blogsStore';
import { isAuthorized } from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> } | { params: { id: string } }
) {
  const rawParams: any = (context as any).params;
  const { id } = typeof rawParams?.then === 'function' ? await rawParams : rawParams;
  const blog = await getBlog(id);
  if (!blog) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(blog);
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } | { params: { id: string } }
) {
  if (!isAuthorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const parsed = validateBlogInput(body);
    if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
    const rawParams: any = (context as any).params;
    const { id } = typeof rawParams?.then === 'function' ? await rawParams : rawParams;
    const updated = await updateBlog(id, parsed.value as any);
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } | { params: { id: string } }
) {
  if (!isAuthorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const rawParams: any = (context as any).params;
    const { id } = typeof rawParams?.then === 'function' ? await rawParams : rawParams;
    const updated = await updateBlog(id, body);
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> } | { params: { id: string } }
) {
  if (!isAuthorized(_req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const rawParams: any = (context as any).params;
  const { id } = typeof rawParams?.then === 'function' ? await rawParams : rawParams;
  const ok = await deleteBlog(id);
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
