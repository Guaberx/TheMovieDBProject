import { Component, input, output } from '@angular/core';

/** The "Load more" button under a paged list. */
@Component({
  selector: 'app-load-more',
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
  readonly load = output();
}
