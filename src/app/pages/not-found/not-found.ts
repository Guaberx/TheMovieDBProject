import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <div class="empty-state">
      <p class="empty-state-code" aria-hidden="true">404</p>
      <h1 class="h3 text-white">Page not found</h1>
      <p>The page you're looking for doesn't exist or was moved.</p>
      <a class="searchButton px-3" routerLink="/movies">Browse movies</a>
    </div>
  `,
})
export class NotFound {}
