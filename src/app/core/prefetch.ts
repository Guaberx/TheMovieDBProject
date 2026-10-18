import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { parseIdSlug } from './slug';
import { TmdbApi } from './tmdb-api';

/** Not in TypeScript's DOM types yet (Chromium only). */
interface NetworkInformation {
  saveData?: boolean;
  effectiveType?: string;
}

/**
 * Starts loading a detail page's data before the user clicks its card, so the page usually
 * opens without a spinner. Requests go through TmdbApi's cache, so the page reuses them.
 */
@Injectable({ providedIn: 'root' })
export class Prefetch {
  private readonly api = inject(TmdbApi);

  /** `link` is a card link like ['/movies', '429617-spider-man-far-from-home']. */
  link(link: readonly unknown[], imagePath?: string | null) {
    if (this.shouldSaveData()) return;
    const [section, segment] = link;
    const id = parseIdSlug(typeof segment === 'string' ? segment : undefined);
    if (id === undefined) return;

    const ignoreErrors = { error: () => {} };
    if (section === '/movies') {
      this.api.movie(id).subscribe(ignoreErrors);
      this.api.movieCredits(id).subscribe(ignoreErrors);
      this.api.similarMovies(id).subscribe(ignoreErrors);
    } else if (section === '/actors') {
      this.api.person(id).subscribe(ignoreErrors);
      this.api.personMovieCredits(id).subscribe(ignoreErrors);
    } else {
      return;
    }
    // The detail page shows the same image in its big (w500) size.
    if (imagePath) new Image().src = `${environment.tmdb.imageBaseUrl}/w500${imagePath}`;
  }

  private shouldSaveData() {
    const connection = (navigator as { connection?: NetworkInformation }).connection;
    return !!connection?.saveData || !!connection?.effectiveType?.includes('2g');
  }
}
