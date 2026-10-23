import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CARD_IMAGE_SIZES, cardImageSrcset, tmdbImage } from './images';
import { parseIdSlug } from './slug';
import { TmdbApi } from './tmdb-api';
import { Paged } from './tmdb.models';

/** Not in TypeScript's DOM types yet (Chromium only). */
interface NetworkInformation {
  saveData?: boolean;
  effectiveType?: string;
}

/** Images in the first row of a card grid, which is what shows up first after a click. */
const FIRST_ROW = 6;

/**
 * Starts loading a page's data before the user clicks the link to it, so the page usually
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
    if (imagePath) new Image().src = tmdbImage(imagePath, 'w500');
  }

  /** The first page of the Movies or Actors list, for the navbar links. */
  section(path: '/movies' | '/actors') {
    if (path === '/movies') this.list(this.api.popularMovies(), (m) => m.poster_path);
    else this.list(this.api.popularPeople(), (p) => p.profile_path);
  }

  /** A page of a card list plus its first row of images. */
  list<T>(request: Observable<Paged<T>>, imagePath: (item: T) => string | null) {
    if (this.shouldSaveData()) return;
    request.subscribe({
      next: (page) =>
        page.results.slice(0, FIRST_ROW).forEach((item) => this.cardImage(imagePath(item))),
      error: () => {},
    });
  }

  // Same srcset and sizes as the card's <img>, so the browser picks (and caches) the same file.
  private cardImage(path: string | null) {
    if (!path) return;
    const image = new Image();
    image.sizes = CARD_IMAGE_SIZES;
    image.srcset = cardImageSrcset(path);
    image.src = tmdbImage(path, 'w500');
  }

  private shouldSaveData() {
    const connection = (navigator as { connection?: NetworkInformation }).connection;
    return !!connection?.saveData || !!connection?.effectiveType?.includes('2g');
  }
}
