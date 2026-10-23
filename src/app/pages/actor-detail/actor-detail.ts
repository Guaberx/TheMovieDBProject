import { DatePipe } from '@angular/common';
import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { year } from '../../core/format';
import { isNotFound } from '../../core/http-errors';
import { valueOrUndefined } from '../../core/resource';
import { TmdbApi } from '../../core/tmdb-api';
import { idSlug, movieLink, parseIdSlug } from '../../core/slug';
import { LoadError } from '../../shared/load-error/load-error';
import { Loading } from '../../shared/loading/loading';
import { PosterCard } from '../../shared/poster-card/poster-card';
import { NotFound } from '../not-found/not-found';

@Component({
  selector: 'app-actor-detail',
  imports: [PosterCard, Loading, LoadError, NotFound, DatePipe],
  templateUrl: './actor-detail.html',
})
export class ActorDetail {
  private readonly api = inject(TmdbApi);
  private readonly router = inject(Router);
  private readonly title = inject(Title);

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

  // Credits come in no useful order, so show the most popular ones.
  protected readonly movies = computed(() =>
    [...(valueOrUndefined(this.credits)?.cast ?? [])]
      .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0))
      .slice(0, 6),
  );
  protected readonly movieLink = movieLink;
  protected readonly year = year;

  // Long biographies start collapsed to a few lines.
  protected readonly bioExpanded = signal(false);
  protected readonly longBio = computed(
    () => (valueOrUndefined(this.actor)?.biography.length ?? 0) > 600,
  );

  protected readonly notFound = computed(
    () => this.actorId() === undefined || isNotFound(this.actor.error()),
  );

  protected retry() {
    this.actor.reload();
    this.credits.reload();
  }

  constructor() {
    effect(() => {
      const actor = valueOrUndefined(this.actor);
      const loaded = actor && actor.id === this.actorId();
      this.title.setTitle(
        loaded
          ? `${actor.name} · MoviesApp`
          : this.notFound()
            ? 'Not found · MoviesApp'
            : 'Actor · MoviesApp',
      );
    });

    // Fix up a missing or outdated slug so the address bar always shows the canonical URL.
    effect(() => {
      const actor = valueOrUndefined(this.actor);
      // Skip stale data from the previous actor while the new one loads.
      if (!actor || actor.id !== this.actorId()) return;
      const canonical = idSlug(actor.id, actor.name);
      if (this.id() !== canonical) {
        this.router.navigate(['/actors', canonical], { replaceUrl: true });
      }
    });
  }
}
