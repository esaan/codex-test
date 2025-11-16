import { validateJobInput } from '@/lib/jobsStore';

const baseJob = {
  title: 'Engineer',
  company: 'Acme',
  location: 'Remote',
  remote: 'Remote',
  type: 'Full-time',
  url: 'https://example.com/job',
  tags: ['Next.js', 'TypeScript'],
  description: 'Build cool things',
};

describe('validateJobInput', () => {
  it('accepts valid input and normalizes tags', () => {
    const result = validateJobInput({ ...baseJob, tags: ['Next.js', ' TS '] });
    expect(result.ok).toBe(true);
    if (result.ok) {
      // The store preserves provided tags, so only expect identical values.
      expect(result.value.tags).toEqual(['Next.js', ' TS ']);
      expect(result.value.description).toBe(baseJob.description);
      expect(result.value.postedAt).toBeUndefined();
    }
  });

  it('rejects invalid remote, type, and url values', () => {
    const badRemote = validateJobInput({ ...baseJob, remote: 'Somewhere' });
    expect(badRemote).toEqual({ ok: false, error: 'Invalid remote value' });

    const badType = validateJobInput({ ...baseJob, type: 'Gig' });
    expect(badType).toEqual({ ok: false, error: 'Invalid type value' });

    const badUrl = validateJobInput({ ...baseJob, url: 'ftp://example.com' });
    expect(badUrl).toEqual({ ok: false, error: 'URL must be http(s)' });
  });

  it('validates tags length and count', () => {
    const tooMany = validateJobInput({
      ...baseJob,
      tags: new Array(11).fill('tag'),
    });
    expect(tooMany).toEqual({ ok: false, error: 'Too many tags (max 10)' });

    const invalidLength = validateJobInput({
      ...baseJob,
      tags: ['A'],
    });
    expect(invalidLength).toEqual({ ok: false, error: 'Invalid tag(s): length must be 2-32' });
  });
});
