import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { TmdbApi } from '../../core/tmdb-api';
import { actorLink } from '../../core/slug';
import { LoadError } from '../../shared/load-error/load-error';
import { Loading } from '../../shared/loading/loading';
import { PosterCard } from '../../shared/poster-card/poster-card';

@Component({
  selector: 'app-actors',
  imports: [PosterCard, Loading, LoadError],
  template: `
    @if (actors.hasValue()) {
      <div class="container padtop-5 pb-5">
        <h1 class="page-title">Popular actors</h1>
        <div class="card-grid">
          @for (actor of actors.value().results; track actor.id) {
            <app-poster-card
              [imagePath]="actor.profile_path"
              [title]="actor.name"
              [link]="actorLink(actor)"
            />
          }
        </div>
      </div>
    } @else if (actors.error()) {
      <app-load-error (retry)="actors.reload()" />
    } @else {
      <app-loading />
    }
  `,
})
export class Actors {
  private readonly api = inject(TmdbApi);

  protected readonly actors = rxResource({ stream: () => this.api.popularPeople() });
  protected readonly actorLink = actorLink;
}
