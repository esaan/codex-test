import { NextResponse, NextRequest } from 'next/server';
import { graphql, buildSchema } from 'graphql';
import { listBlogs, getBlog as getBlogById, getBlogBySlug, createBlog, updateBlog, deleteBlog, validateBlogInput } from '@/lib/blogsStore';
import { listReviews, createReview, deleteReview, getRatingSummary, validateReviewInput } from '@/lib/reviewsStore';
import { isAuthorized } from '@/lib/auth';
import { listJobs, getJob, createJob, updateJob, deleteJob, validateJobInput } from '@/lib/jobsStore';

export const runtime = 'nodejs';

const schema = buildSchema(`
  type Blog {
    id: ID!
    title: String!
    slug: String!
    content: String!
    publishedAt: String!
    updatedAt: String
    tags: [String!]!
    author: String
    excerpt: String
    ratingAverage: Float!
    ratingCount: Int!
    reviews: [Review!]!
  }

  type Review {
    id: ID!
    blogId: ID!
    rating: Int!
    comment: String!
    author: String
    createdAt: String!
  }

  type Job {
    id: ID!
    title: String!
    company: String!
    location: String!
    remote: String!
    type: String!
    postedAt: String!
    url: String!
    tags: [String!]!
    description: String
  }

  type RatingSummary { average: Float!, count: Int! }

  input BlogInput {
    title: String!
    slug: String
    content: String!
    tags: [String!]
    author: String
    excerpt: String
    publishedAt: String
  }

  input BlogPatch {
    title: String
    slug: String
    content: String
    tags: [String!]
    author: String
    excerpt: String
    publishedAt: String
  }

  input ReviewInput { rating: Int!, comment: String!, author: String }

  input JobInput {
    title: String!
    company: String!
    location: String!
    remote: String!
    type: String!
    url: String!
    tags: [String!]
    description: String
    postedAt: String
  }

  type Query {
    blogs: [Blog!]!
    blog(id: ID, slug: String): Blog
    reviews(blogId: ID!): [Review!]!
    ratingSummary(blogId: ID!): RatingSummary!
    jobs: [Job!]!
    job(id: ID!): Job
  }

  type Mutation {
    createBlog(input: BlogInput!): Blog!
    updateBlog(id: ID!, input: BlogPatch!): Blog
    deleteBlog(id: ID!): Boolean!
    createReview(blogId: ID!, input: ReviewInput!): Review!
    deleteReview(blogId: ID!, reviewId: ID!): Boolean!
    createJob(input: JobInput!): Job!
    updateJob(id: ID!, input: JobInput!): Job
    deleteJob(id: ID!): Boolean!
  }
`);

type Ctx = { req: Request };

const root = {
  // Queries
  blogs: async () => listBlogs(),
  blog: async ({ id, slug }: { id?: string; slug?: string }) => {
    if (id) return getBlogById(id);
    if (slug) return getBlogBySlug(slug);
    return null;
  },
  reviews: async ({ blogId }: { blogId: string }) => listReviews(blogId),
  ratingSummary: async ({ blogId }: { blogId: string }) => getRatingSummary(blogId),
  jobs: async () => listJobs(),
  job: async ({ id }: { id: string }) => getJob(id),

  // Field resolvers
  Blog: {
    ratingAverage: async (blog: any) => (await getRatingSummary(blog.id)).average,
    ratingCount: async (blog: any) => (await getRatingSummary(blog.id)).count,
    reviews: async (blog: any) => listReviews(blog.id),
  },

  // Mutations
  createBlog: async ({ input }: { input: any }, ctx: Ctx) => {
    if (!isAuthorized(ctx.req)) throw new Error('Unauthorized');
    const parsed = validateBlogInput(input);
    if (!parsed.ok) throw new Error(parsed.error);
    return createBlog(parsed.value as any);
  },
  updateBlog: async ({ id, input }: { id: string; input: any }, ctx: Ctx) => {
    if (!isAuthorized(ctx.req)) throw new Error('Unauthorized');
    const parsed = validateBlogInput({ ...input, title: input.title ?? 'x', content: input.content ?? 'x' });
    if (!parsed.ok) throw new Error(parsed.error);
    return updateBlog(id, parsed.value as any);
  },
  deleteBlog: async ({ id }: { id: string }, ctx: Ctx) => {
    if (!isAuthorized(ctx.req)) throw new Error('Unauthorized');
    return deleteBlog(id);
  },
  createReview: async ({ blogId, input }: { blogId: string; input: any }) => {
    const parsed = validateReviewInput(input);
    if (!parsed.ok) throw new Error(parsed.error);
    return createReview(blogId, parsed.value as any);
  },
  deleteReview: async ({ blogId, reviewId }: { blogId: string; reviewId: string }, ctx: Ctx) => {
    if (!isAuthorized(ctx.req)) throw new Error('Unauthorized');
    return deleteReview(blogId, reviewId);
  },
  createJob: async ({ input }: { input: any }, ctx: Ctx) => {
    if (!isAuthorized(ctx.req)) throw new Error('Unauthorized');
    const parsed = validateJobInput(input);
    if (!parsed.ok) throw new Error(parsed.error);
    const now = new Date().toISOString();
    const id = (globalThis as any).crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2);
    const job = { id, postedAt: parsed.value.postedAt ?? now, ...parsed.value } as any;
    return createJob(job);
  },
  updateJob: async ({ id, input }: { id: string; input: any }, ctx: Ctx) => {
    if (!isAuthorized(ctx.req)) throw new Error('Unauthorized');
    const parsed = validateJobInput({ ...input, title: input.title ?? 'x', company: input.company ?? 'x', location: input.location ?? 'x', remote: input.remote ?? 'Remote', type: input.type ?? 'Full-time', url: input.url ?? 'https://example.com' });
    if (!parsed.ok) throw new Error(parsed.error);
    return updateJob(id, parsed.value as any);
  },
  deleteJob: async ({ id }: { id: string }, ctx: Ctx) => {
    if (!isAuthorized(ctx.req)) throw new Error('Unauthorized');
    return deleteJob(id);
  },
};

async function handlePost(req: NextRequest) {
  try {
    const { query, variables, operationName } = await req.json();
    const result = await graphql({
      schema,
      source: query,
      variableValues: variables,
      operationName,
      rootValue: root,
      contextValue: { req },
    });
    const status = result.errors ? 400 : 200;
    return NextResponse.json(result, { status });
  } catch (e: any) {
    return NextResponse.json({ errors: [{ message: e.message || 'Invalid request' }] }, { status: 400 });
  }
}

export async function POST(req: NextRequest) { return handlePost(req); }

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const query = url.searchParams.get('query');
  const variablesRaw = url.searchParams.get('variables');
  const operationName = url.searchParams.get('operationName') ?? undefined;
  if (!query) {
    return NextResponse.json({
      ok: true,
      message: 'GraphQL endpoint. POST JSON { query, variables, operationName } or GET with ?query=...&variables=...'
    });
  }
  let variables: any = undefined;
  if (variablesRaw) {
    try { variables = JSON.parse(variablesRaw); } catch { variables = undefined; }
  }
  const result = await graphql({
    schema,
    source: query,
    variableValues: variables,
    operationName,
    rootValue: root,
    contextValue: { req },
  });
  const status = result.errors ? 400 : 200;
  return NextResponse.json(result, { status });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: { 'Allow': 'GET,POST,OPTIONS' } });
}
