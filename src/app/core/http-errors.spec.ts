import { HttpErrorResponse } from '@angular/common/http';
import { isNotFound } from './http-errors';

describe('isNotFound', () => {
  const notFound = new HttpErrorResponse({ status: 404 });
  const serverError = new HttpErrorResponse({ status: 500 });

  it('is true only for 404 responses', () => {
    expect(isNotFound(notFound)).toBe(true);
    expect(isNotFound(serverError)).toBe(false);
    expect(isNotFound(new HttpErrorResponse({ status: 0 }))).toBe(false);
    expect(isNotFound(undefined)).toBe(false);
  });

  it('looks inside wrapped errors', () => {
    expect(isNotFound(new Error('wrapped', { cause: notFound }))).toBe(true);
    expect(isNotFound(new Error('wrapped', { cause: serverError }))).toBe(false);
  });
});
