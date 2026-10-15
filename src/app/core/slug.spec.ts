import { idSlug, parseIdSlug, slugify } from './slug';

describe('slug', () => {
  it('slugifies titles', () => {
    expect(slugify('Spider-Man: Far From Home')).toBe('spider-man-far-from-home');
    expect(slugify('Amélie')).toBe('amelie');
    expect(slugify('  WALL·E!! ')).toBe('wall-e');
  });

  it('builds id-slug segments, falling back to the bare id', () => {
    expect(idSlug(429617, 'Spider-Man: Far From Home')).toBe('429617-spider-man-far-from-home');
    expect(idSlug(1, '千と千尋の神隠し')).toBe('1');
  });

  it('parses the id and ignores the slug', () => {
    expect(parseIdSlug('429617-spider-man-far-from-home')).toBe(429617);
    expect(parseIdSlug('429617-wrong-slug')).toBe(429617);
    expect(parseIdSlug('429617')).toBe(429617);
    expect(parseIdSlug('abc')).toBeUndefined();
    expect(parseIdSlug('12abc')).toBeUndefined();
    expect(parseIdSlug(undefined)).toBeUndefined();
  });
});
