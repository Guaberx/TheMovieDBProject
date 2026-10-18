import { HttpErrorResponse } from '@angular/common/http';

/**
 * True when TMDB answered 404 (the movie or person doesn't exist), as opposed to a network
 * error, rate limit or outage. Resources wrap non-Error values like HttpErrorResponse, so the
 * original error may be in `cause`.
 */
export function isNotFound(error: unknown): boolean {
  const cause = error instanceof Error && error.cause !== undefined ? error.cause : error;
  return cause instanceof HttpErrorResponse && cause.status === 404;
}
