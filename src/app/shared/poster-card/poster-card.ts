import { DecimalPipe, NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CARD_IMAGE_SIZES, cardImageSrcset, tmdbImage } from '../../core/images';
import { Prefetch } from '../../core/prefetch';
import { PrefetchOn } from '../prefetch-on/prefetch-on';

/** A poster or profile photo. Linked cards add a title, subtitle, rating and hover effect; unlinked ones are the big detail-page image. */
@Component({
  selector: 'app-poster-card',
  imports: [RouterLink, NgTemplateOutlet, DecimalPipe, PrefetchOn],
  templateUrl: './poster-card.html',
  host: {
    class: 'poster',
    '[class.animated]': '!!link()',
    '[class.big]': 'big()',
  },
})
export class PosterCard {
  private readonly prefetch = inject(Prefetch);

  readonly imagePath = input<string | null>();
  readonly title = input.required<string>();
  /** Small line under the title, e.g. the year or the character played. */
  readonly subtitle = input<string>();
  /** 0 means TMDB has no votes yet, so no badge is shown. */
  readonly rating = input<number>();
  readonly link = input<unknown[]>();
  readonly big = input(false);

  // The big detail-page poster always uses the 500px version.
  protected readonly src = computed(() => tmdbImage(this.imagePath(), 'w500'));
  protected readonly srcset = computed(() =>
    this.big() ? null : cardImageSrcset(this.imagePath()),
  );
  protected readonly sizes = CARD_IMAGE_SIZES;

  protected readonly prefetchDetail = () => {
    const link = this.link();
    if (link) this.prefetch.link(link, this.imagePath());
  };
}
