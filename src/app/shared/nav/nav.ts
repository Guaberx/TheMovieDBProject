import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, map } from 'rxjs';
import { Prefetch } from '../../core/prefetch';
import { PrefetchOn } from '../prefetch-on/prefetch-on';

@Component({
  selector: 'app-nav',
  imports: [RouterLink, RouterLinkActive, PrefetchOn],
  templateUrl: './nav.html',
})
export class Nav {
  private readonly router = inject(Router);
  private readonly prefetch = inject(Prefetch);
  protected readonly menuOpen = signal(false);

  protected readonly prefetchMovies = () => this.prefetch.section('/movies');
  protected readonly prefetchActors = () => this.prefetch.section('/actors');

  /** The ?q= of the current URL, so the search box matches the results after links, reloads and Back. */
  protected readonly query = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => this.router.parseUrl(this.router.url).queryParamMap.get('q') ?? ''),
    ),
    { initialValue: '' },
  );

  protected search(query: string) {
    query = query.trim();
    this.menuOpen.set(false);
    this.router.navigate(['/movies'], { queryParams: query ? { q: query } : {} });
  }
}
