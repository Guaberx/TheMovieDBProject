import { Component, computed, effect, inject, input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { pagedResource } from '../../core/paged';
import { actorLink } from '../../core/slug';
import { TmdbApi } from '../../core/tmdb-api';
import { LoadError } from '../../shared/load-error/load-error';
import { LoadMore } from '../../shared/load-more/load-more';
import { Loading } from '../../shared/loading/loading';
import { PosterCard } from '../../shared/poster-card/poster-card';

/** Popular actors, or actors matching ?q= (linked from the movie search results). */
@Component({
  selector: 'app-actors',
  imports: [PosterCard, Loading, LoadError, LoadMore],
  template: `
    @if (actors.first.hasValue()) {
      <div class="container padtop-6 pb-5">
        @if (query()) {
          <h1 class="page-title">Actors matching “{{ query() }}”</h1>
        } @else {
          <h1 class="page-title">Popular actors</h1>
        }
        @if (actors.items().length) {
          <div class="card-grid">
            @for (actor of actors.items(); track actor.id) {
              <app-poster-card
                [imagePath]="actor.profile_path"
                [title]="actor.name"
                [link]="actorLink(actor)"
              />
            }
          </div>
          @if (actors.hasMore()) {
            <app-load-more
              [loading]="actors.loadingMore()"
              [failed]="actors.loadMoreFailed()"
              [prefetch]="actors.prefetchNext"
              (load)="actors.loadMore()"
            />
          }
        } @else {
          <div class="empty-state empty-state-inline">
            <p>No actors match your search. Try a different name.</p>
          </div>
        }
      </div>
    } @else if (actors.first.error()) {
      <app-load-error (retry)="actors.first.reload()" />
    } @else {
      <app-loading />
    }
  `,
})
export class Actors {
  private readonly api = inject(TmdbApi);

  readonly q = input<string>();
  protected readonly query = computed(() => this.q()?.trim() ?? '');

  protected readonly actors = pagedResource({
    key: 'actors',
    params: () => this.query(),
    load: (query, page) =>
      query ? this.api.searchPeople(query, page) : this.api.popularPeople(page),
    imagePath: (actor) => actor.profile_path,
  });
  protected readonly actorLink = actorLink;

  constructor() {
    const title = inject(Title);
    effect(() => {
      const query = this.query();
      title.setTitle(query ? `Actors matching “${query}” · MoviesApp` : 'Actors · MoviesApp');
    });
  }
}
