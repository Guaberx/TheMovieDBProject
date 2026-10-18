import { DecimalPipe, NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Prefetch } from '../../core/prefetch';

/** A poster or profile photo. Linked cards show the overlays and hover effect; unlinked ones are the big detail-page image. */
@Component({
  selector: 'app-poster-card',
  imports: [RouterLink, NgTemplateOutlet, DecimalPipe],
  templateUrl: './poster-card.html',
  host: {
    class: 'poster',
    '[class.animated]': '!!link()',
    '[class.big]': 'big()',
  },
})
export class PosterCard {
  private readonly prefetch = inject(Prefetch);
  private hoverTimer?: ReturnType<typeof setTimeout>;

  readonly imagePath = input<string | null>();
  readonly title = input.required<string>();
  readonly rating = input<number>();
  readonly link = input<unknown[]>();
  readonly big = input(false);

  // Cards render about 160px wide, so the browser picks 185px or 342px (high-DPI) images.
  // The big detail-page poster always uses the 500px version.
  protected readonly src = computed(() => this.imageUrl('w500'));
  protected readonly srcset = computed(() =>
    this.big()
      ? null
      : ['w185', 'w342', 'w500'].map((w) => `${this.imageUrl(w)} ${w.slice(1)}w`).join(', '),
  );

  // A short hover delay skips cards the pointer only passes over; focus and press prefetch right away.
  protected hoverStart() {
    this.hoverTimer ??= setTimeout(() => this.prefetchNow(), 100);
  }

  protected hoverEnd() {
    clearTimeout(this.hoverTimer);
    this.hoverTimer = undefined;
  }

  protected prefetchNow() {
    this.hoverEnd();
    const link = this.link();
    if (link) this.prefetch.link(link, this.imagePath());
  }

  private imageUrl(size: string) {
    return `${environment.tmdb.imageBaseUrl}/${size}${this.imagePath()}`;
  }
}
