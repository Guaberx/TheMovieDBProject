import { DecimalPipe, NgTemplateOutlet } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';

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

  private imageUrl(size: string) {
    return `${environment.tmdb.imageBaseUrl}/${size}${this.imagePath()}`;
  }
}
