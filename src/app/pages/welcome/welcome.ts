import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-welcome',
  imports: [RouterLink],
  template: `
    <a routerLink="/movies" class="startbtn">
      <h1 class="welcome-title">MoviesApp</h1>
      <span class="welcome-watch">Watch</span>
    </a>
  `,
})
export class Welcome {}
