import { Component, inject } from '@angular/core';
import { pagedResource } from '../../core/paged';
import { TmdbApi } from '../../core/tmdb-api';
import { actorLink } from '../../core/slug';
import { LoadError } from '../../shared/load-error/load-error';
import { LoadMore } from '../../shared/load-more/load-more';
import { Loading } from '../../shared/loading/loading';
import { PosterCard } from '../../shared/poster-card/poster-card';

@Component({
  selector: 'app-actors',
  imports: [PosterCard, Loading, LoadError, LoadMore],
  template: `
    @if (actors.first.hasValue()) {
      <div class="container padtop-5 pb-5">
        <h1 class="page-title">Popular actors</h1>
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
            (load)="actors.loadMore()"
          />
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

  protected readonly actors = pagedResource({
    params: () => null,
    load: (_, page) => this.api.popularPeople(page),
  });
  protected readonly actorLink = actorLink;
}
