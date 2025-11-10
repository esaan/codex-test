import { NextResponse } from 'next/server';
import { createBlog, listBlogs, validateBlogInput } from '@/lib/blogsStore';
import { isAuthorized } from '@/lib/auth';
import type { Blog } from '@/lib/types';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const blogs = await listBlogs();
    return NextResponse.json(blogs);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to load blogs' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await req.json();
    const parsed = validateBlogInput(body);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const created = await createBlog(parsed.value as any);
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
}

