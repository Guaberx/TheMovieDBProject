import { Component, computed, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { TmdbApi } from '../../core/tmdb-api';
import { movieLink } from '../../core/slug';
import { Loading } from '../../shared/loading/loading';
import { PosterCard } from '../../shared/poster-card/poster-card';
import { NotFound } from '../not-found/not-found';

/** Popular movies, or search results when there's a ?q= query param. */
@Component({
  selector: 'app-movies',
  imports: [PosterCard, Loading, NotFound],
  templateUrl: './movies.html',
})
export class Movies {
  private readonly api = inject(TmdbApi);

  readonly q = input<string>();
  protected readonly query = computed(() => this.q()?.trim() ?? '');

  protected readonly movies = rxResource({
    params: () => ({ query: this.query() }),
    stream: ({ params }) =>
      params.query ? this.api.searchMovies(params.query) : this.api.popularMovies(),
  });

  protected readonly movieLink = movieLink;
}
