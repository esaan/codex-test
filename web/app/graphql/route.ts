import { NextResponse, NextRequest } from 'next/server';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  // Friendly alias: redirect to /api/graphql
  const url = new URL('/api/graphql', req.url);
  return NextResponse.redirect(url, { status: 307 });
}

export async function POST(req: NextRequest) {
  // Preserve method/body via 307 redirect to the API route
  const url = new URL('/api/graphql', req.url);
  return NextResponse.redirect(url, { status: 307 });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: { 'Allow': 'GET,POST,OPTIONS' } });
}

