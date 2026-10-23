import { Component, computed, effect, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { year } from '../../core/format';
import { pagedResource } from '../../core/paged';
import { valueOrUndefined } from '../../core/resource';
import { actorLink, movieLink } from '../../core/slug';
import { TmdbApi } from '../../core/tmdb-api';
import { LoadError } from '../../shared/load-error/load-error';
import { LoadMore } from '../../shared/load-more/load-more';
import { Loading } from '../../shared/loading/loading';
import { PosterCard } from '../../shared/poster-card/poster-card';

/**
 * Popular movies, optionally in one genre (?genre=28), or search results when there's a ?q=
 * query param. Search results also show the first few matching actors.
 */
@Component({
  selector: 'app-movies',
  imports: [PosterCard, Loading, LoadError, LoadMore, RouterLink],
  templateUrl: './movies.html',
})
export class Movies {
  private readonly api = inject(TmdbApi);

  readonly q = input<string>();
  readonly genre = input<string>();
  protected readonly query = computed(() => this.q()?.trim() ?? '');
  protected readonly genreId = computed(() => {
    const id = Number(this.genre());
    return Number.isInteger(id) && id > 0 ? id : undefined;
  });

  protected readonly movies = pagedResource({
    key: 'movies',
    params: () => ({ query: this.query(), genre: this.genreId() }),
    load: ({ query, genre }, page) =>
      query
        ? this.api.searchMovies(query, page)
        : genre
          ? this.api.moviesByGenre(genre, page)
          : this.api.popularMovies(page),
    imagePath: (movie) => movie.poster_path,
  });

  // Genre filters only apply to the popular list; TMDB's search can't filter by genre.
  protected readonly genres = rxResource({ stream: () => this.api.movieGenres() });
  protected readonly genreList = computed(() => valueOrUndefined(this.genres)?.genres ?? []);
  protected readonly genreName = computed(
    () => this.genreList().find((g) => g.id === this.genreId())?.name,
  );

  // Without a query the params are undefined, which leaves the resource idle (no request).
  protected readonly people = rxResource({
    params: () => this.query() || undefined,
    stream: ({ params }) => this.api.searchPeople(params),
  });
  protected readonly matchingPeople = computed(
    () => valueOrUndefined(this.people)?.results.slice(0, 6) ?? [],
  );
  protected readonly morePeople = computed(
    () => (valueOrUndefined(this.people)?.total_results ?? 0) > 6,
  );

  protected readonly heading = computed(() => {
    const query = this.query();
    if (query) return `Results for “${query}”`;
    const genre = this.genreName();
    return genre ? `Popular ${genre.toLowerCase()} movies` : 'Popular movies';
  });

  protected readonly actorLink = actorLink;
  protected readonly movieLink = movieLink;
  protected readonly year = year;

  constructor() {
    const title = inject(Title);
    effect(() => {
      const query = this.query();
      const genre = this.genreName();
      title.setTitle(
        query
          ? `Results for “${query}” · MoviesApp`
          : genre
            ? `${genre} movies · MoviesApp`
            : 'Movies · MoviesApp',
      );
    });
  }
}
