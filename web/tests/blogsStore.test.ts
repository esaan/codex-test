import { validateBlogInput } from '@/lib/blogsStore';

describe('validateBlogInput', () => {
  const valid = {
    title: 'Test Post',
    content: 'Hello world',
    tags: ['Health', 'Wellness'],
    author: 'Codex',
    excerpt: 'Summary',
    slug: 'test-post',
  };

  it('accepts minimal valid payload', () => {
    const result = validateBlogInput(valid);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.title).toBe(valid.title);
      expect(result.value.content).toBe(valid.content);
      expect(result.value.tags).toEqual(valid.tags);
      expect(result.value.slug).toBe(valid.slug);
    }
  });

  it('rejects missing title or content', () => {
    expect(validateBlogInput({ ...valid, title: '' })).toEqual({
      ok: false,
      error: "Missing or invalid 'title'",
    });
    expect(validateBlogInput({ ...valid, content: '' })).toEqual({
      ok: false,
      error: "Missing or invalid 'content'",
    });
  });

  it('enforces tag limits and trimming', () => {
    const tooMany = validateBlogInput({
      ...valid,
      tags: new Array(11).fill('tag'),
    });
    expect(tooMany).toEqual({ ok: false, error: 'Too many tags (max 10)' });

    const invalidLength = validateBlogInput({
      ...valid,
      tags: ['a'],
    });
    expect(invalidLength).toEqual({
      ok: false,
      error: 'Invalid tag(s): length must be 2-32',
    });
  });
});
