import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-welcome',
  imports: [RouterLink],
  template: `
    <a routerLink="/movies" class="startbtn" aria-label="Browse movies">
      <svg height="100vh" width="90vw">
        <text
          x="50vw"
          y="35vh"
          font-size="15vw"
          fill="white"
          text-anchor="middle"
          dominant-baseline="central"
        >
          MoviesApp
        </text>
        <rect width="12vw" height="100vh" fill="rgba(255, 0, 0, .7)" />
        <rect
          x="44vw"
          y="67vh"
          rx="15"
          ry="15"
          width="12vw"
          height="8vh"
          fill="rgba(255, 0, 0, .7)"
        />
        <text
          x="50vw"
          y="71vh"
          font-size="4vw"
          fill="white"
          text-anchor="middle"
          dominant-baseline="central"
        >
          Watch
        </text>
      </svg>
    </a>
  `,
})
export class Welcome {}
