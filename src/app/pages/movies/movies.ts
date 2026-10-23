import { Component, computed, effect, inject, input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TmdbApi } from '../../core/tmdb-api';
import { year } from '../../core/format';
import { pagedResource } from '../../core/paged';
import { movieLink } from '../../core/slug';
import { LoadError } from '../../shared/load-error/load-error';
import { LoadMore } from '../../shared/load-more/load-more';
import { Loading } from '../../shared/loading/loading';
import { PosterCard } from '../../shared/poster-card/poster-card';

/** Popular movies, or search results when there's a ?q= query param. */
@Component({
  selector: 'app-movies',
  imports: [PosterCard, Loading, LoadError, LoadMore],
  templateUrl: './movies.html',
})
export class Movies {
  private readonly api = inject(TmdbApi);

  readonly q = input<string>();
  protected readonly query = computed(() => this.q()?.trim() ?? '');

  protected readonly movies = pagedResource({
    key: 'movies',
    params: () => this.query(),
    load: (query, page) =>
      query ? this.api.searchMovies(query, page) : this.api.popularMovies(page),
    imagePath: (movie) => movie.poster_path,
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
