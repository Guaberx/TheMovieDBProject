import { Component, computed, effect, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { TmdbApi } from '../../core/tmdb-api';
import { idSlug, movieLink, parseIdSlug } from '../../core/slug';
import { Loading } from '../../shared/loading/loading';
import { PosterCard } from '../../shared/poster-card/poster-card';
import { NotFound } from '../not-found/not-found';

@Component({
  selector: 'app-actor-detail',
  imports: [PosterCard, Loading, NotFound],
  templateUrl: './actor-detail.html',
})
export class ActorDetail {
  private readonly api = inject(TmdbApi);
  private readonly router = inject(Router);

  /** The ":id" route segment, e.g. "1136406-tom-holland". */
  readonly id = input.required<string>();
  protected readonly actorId = computed(() => parseIdSlug(this.id()));

  protected readonly actor = rxResource({
    params: () => this.actorId(),
    stream: ({ params }) => this.api.person(params),
  });
  protected readonly credits = rxResource({
    params: () => this.actorId(),
    stream: ({ params }) => this.api.personMovieCredits(params),
  });

  protected readonly movies = computed(() => this.credits.value()?.cast.slice(0, 5) ?? []);
  protected readonly movieLink = movieLink;

  constructor() {
    // Fix up a missing or outdated slug so the address bar always shows the canonical URL.
    effect(() => {
      const actor = this.actor.value();
      // Skip stale data from the previous actor while the new one loads.
      if (!actor || actor.id !== this.actorId()) return;
      const canonical = idSlug(actor.id, actor.name);
      if (this.id() !== canonical) {
        this.router.navigate(['/actors', canonical], { replaceUrl: true });
      }
    });
  }
}
