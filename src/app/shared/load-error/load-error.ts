import { Component, output } from '@angular/core';

/** Shown when TMDB can't be reached (offline, rate limited, outage). Not-found ids get the 404 page instead. */
@Component({
  selector: 'app-load-error',
  template: `
    <div class="text-center padtop-6 vh-100">
      <h1 class="h3 text-white">Couldn't load this page</h1>
      <p class="text-center">Check your connection and try again.</p>
      <button class="searchButton px-3" type="button" (click)="retry.emit()">Try again</button>
    </div>
  `,
})
export class LoadError {
  readonly retry = output();
}
