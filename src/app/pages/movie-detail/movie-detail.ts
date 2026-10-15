import { Component, computed, effect, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { TmdbApi } from '../../core/tmdb-api';
import { actorLink, idSlug, movieLink, parseIdSlug } from '../../core/slug';
import { Loading } from '../../shared/loading/loading';
import { PosterCard } from '../../shared/poster-card/poster-card';
import { NotFound } from '../not-found/not-found';

@Component({
  selector: 'app-movie-detail',
  imports: [PosterCard, Loading, NotFound],
  templateUrl: './movie-detail.html',
})
export class MovieDetail {
  private readonly api = inject(TmdbApi);
  private readonly router = inject(Router);

  /** The ":id" route segment, e.g. "429617-spider-man-far-from-home". */
  readonly id = input.required<string>();
  protected readonly movieId = computed(() => parseIdSlug(this.id()));

  protected readonly movie = rxResource({
    params: () => this.movieId(),
    stream: ({ params }) => this.api.movie(params),
  });
  protected readonly credits = rxResource({
    params: () => this.movieId(),
    stream: ({ params }) => this.api.movieCredits(params),
  });
  protected readonly similar = rxResource({
    params: () => this.movieId(),
    stream: ({ params }) => this.api.similarMovies(params),
  });

  protected readonly cast = computed(() => this.credits.value()?.cast.slice(0, 5) ?? []);
  protected readonly similarMovies = computed(
    () => this.similar.value()?.results.slice(0, 5) ?? [],
  );

  protected readonly actorLink = actorLink;
  protected readonly movieLink = movieLink;

  constructor() {
    // Fix up a missing or outdated slug so the address bar always shows the canonical URL.
    effect(() => {
      const movie = this.movie.value();
      // Skip stale data from the previous movie while the new one loads.
      if (!movie || movie.id !== this.movieId()) return;
      const canonical = idSlug(movie.id, movie.title);
      if (this.id() !== canonical) {
        this.router.navigate(['/movies', canonical], { replaceUrl: true });
      }
    });
  }
}
