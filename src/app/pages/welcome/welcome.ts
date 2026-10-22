import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Prefetch } from '../../core/prefetch';
import { PrefetchOn } from '../../shared/prefetch-on/prefetch-on';

@Component({
  selector: 'app-welcome',
  imports: [RouterLink, PrefetchOn],
  template: `
    <!-- The whole page is one link to /movies, so its data starts loading right away. -->
    <a
      routerLink="/movies"
      class="startbtn"
      [appPrefetch]="prefetchMovies"
      [prefetchWhenVisible]="true"
    >
      <h1 class="welcome-title">Movies<span class="brand-accent">App</span></h1>
      <span class="welcome-tagline">Discover popular movies and the people behind them</span>
      <span class="welcome-watch">Watch ▸</span>
    </a>
  `,
})
export class Welcome {
  private readonly prefetch = inject(Prefetch);
  protected readonly prefetchMovies = () => this.prefetch.section('/movies');
}
