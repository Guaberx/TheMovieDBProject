import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { TmdbApi } from '../../core/tmdb-api';
import { actorLink } from '../../core/slug';
import { Loading } from '../../shared/loading/loading';
import { PosterCard } from '../../shared/poster-card/poster-card';
import { NotFound } from '../not-found/not-found';

@Component({
  selector: 'app-actors',
  imports: [PosterCard, Loading, NotFound],
  template: `
    @if (actors.hasValue()) {
      <div class="outer padtop-5 pb-5">
        <div class="inner">
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
      <app-not-found />
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
