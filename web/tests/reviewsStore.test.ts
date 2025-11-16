import { validateReviewInput } from '@/lib/reviewsStore';

describe('validateReviewInput', () => {
  it('accepts valid payload and trims strings', () => {
    const result = validateReviewInput({ rating: 5, comment: '  Great!  ', author: '  Jane ' });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.rating).toBe(5);
      expect(result.value.comment).toBe('Great!');
      expect(result.value.author).toBe('Jane');
    }
  });

  it('rejects invalid ratings and comments', () => {
    expect(validateReviewInput({ rating: 0, comment: 'Hi' })).toEqual({
      ok: false,
      error: 'Rating must be an integer 1-5',
    });
    expect(validateReviewInput({ rating: 6, comment: 'Hi' })).toEqual({
      ok: false,
      error: 'Rating must be an integer 1-5',
    });
    expect(validateReviewInput({ rating: 5, comment: '' })).toEqual({
      ok: false,
      error: "Missing or invalid 'comment'",
    });
  });

  it('enforces maximum comment length', () => {
    const long = 'a'.repeat(2001);
    expect(validateReviewInput({ rating: 4, comment: long })).toEqual({
      ok: false,
      error: 'Comment too long (max 2000)',
    });
  });
});
