import { runtime, year } from './format';

describe('format', () => {
  it('takes the year from a TMDB date', () => {
    expect(year('2019-06-28')).toBe('2019');
    expect(year('')).toBe('');
    expect(year(undefined)).toBe('');
  });

  it('formats runtimes', () => {
    expect(runtime(129)).toBe('2h 9m');
    expect(runtime(45)).toBe('45m');
    expect(runtime(0)).toBe('');
    expect(runtime(null)).toBe('');
  });
});
