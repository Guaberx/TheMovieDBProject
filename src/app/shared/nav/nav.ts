import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
})
export class Nav {
  private readonly router = inject(Router);
  protected readonly menuOpen = signal(false);

  protected search(query: string) {
    query = query.trim();
    this.menuOpen.set(false);
    this.router.navigate(['/movies'], { queryParams: query ? { q: query } : {} });
  }
}
