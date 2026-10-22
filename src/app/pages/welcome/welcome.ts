import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-welcome',
  imports: [RouterLink],
  template: `
    <a routerLink="/movies" class="startbtn">
      <h1 class="welcome-title">Movies<span class="brand-accent">App</span></h1>
      <span class="welcome-tagline">Discover popular movies and the people behind them</span>
      <span class="welcome-watch">Watch ▸</span>
    </a>
  `,
})
export class Welcome {}
