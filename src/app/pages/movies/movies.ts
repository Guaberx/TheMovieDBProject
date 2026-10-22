import { Component, computed, effect, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { TmdbApi } from '../../core/tmdb-api';
import { year } from '../../core/format';
import { movieLink } from '../../core/slug';
import { LoadError } from '../../shared/load-error/load-error';
import { Loading } from '../../shared/loading/loading';
import { PosterCard } from '../../shared/poster-card/poster-card';

/** Popular movies, or search results when there's a ?q= query param. */
@Component({
  selector: 'app-movies',
  imports: [PosterCard, Loading, LoadError],
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
  protected readonly year = year;

  constructor() {
    const title = inject(Title);
    effect(() => {
      const query = this.query();
      title.setTitle(query ? `Results for “${query}” · MoviesApp` : 'Movies · MoviesApp');
    });
  }
}
