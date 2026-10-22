import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  imports: [RouterLink],
  template: `
    <div class="container padtop-6 pb-5 page-text">
      <h1 class="h3 text-white mb-4"><b>About MoviesApp</b></h1>
      <p>
        MoviesApp lets you browse what's popular in movies, look up actors, and search for any
        title. Each movie shows its rating, overview, cast and similar films; each actor shows a
        short biography and the movies they're known for.
      </p>
      <ul class="feature-list">
        <li><a routerLink="/movies">Popular movies</a>, updated daily by TMDB</li>
        <li><a routerLink="/actors">Popular actors</a> and their filmographies</li>
        <li>Search by title from the bar at the top</li>
      </ul>
      <p>
        Built with Angular and Bootstrap.
        <a href="https://github.com/Guaberx/TheMovieDBProject">Source code on GitHub</a>.
      </p>

      <div class="credit-box">
        <h2 class="h5 text-white">Data source</h2>
        <p class="mb-0">
          Movie and actor data and images come from
          <a href="https://www.themoviedb.org/">The Movie Database (TMDB)</a>. This product uses
          the TMDB API but is not endorsed or certified by TMDB.
        </p>
      </div>
    </div>
  `,
})
export class About {}
