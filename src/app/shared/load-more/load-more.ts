import { Component, input, output } from '@angular/core';
import { PrefetchOn } from '../prefetch-on/prefetch-on';

/** The "Load more" button under a paged list. The next page starts loading as the button nears the screen. */
@Component({
  selector: 'app-load-more',
  imports: [PrefetchOn],
  template: `
    <div class="load-more" aria-live="polite">
      @if (failed()) {
        <p>Couldn't load more results.</p>
      }
      <button
        class="searchButton px-4"
        type="button"
        [disabled]="loading()"
        [attr.aria-busy]="loading()"
        [appPrefetch]="prefetch()"
        [prefetchWhenVisible]="true"
        (click)="load.emit()"
      >
        {{ loading() ? 'Loading…' : failed() ? 'Try again' : 'Load more' }}
      </button>
    </div>
  `,
})
export class LoadMore {
  readonly loading = input(false);
  readonly failed = input(false);
  readonly prefetch = input.required<() => void>();
  readonly load = output();
}
