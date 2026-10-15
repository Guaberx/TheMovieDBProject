import { DecimalPipe, NgTemplateOutlet } from '@angular/common';
import { Component, input } from '@angular/core';
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

  protected readonly imageBaseUrl = environment.tmdb.imageBaseUrl;
}
