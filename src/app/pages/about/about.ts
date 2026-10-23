import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  imports: [RouterLink],
  template: `
    <div class="container padtop-6 pb-5 page-text">
      <h1 class="page-title">About MoviesApp</h1>
      <div class="about-grid">
        <div>
          <p>
            MoviesApp lets you browse what's popular in movies, look up actors, and search for any
            title. Each movie shows its rating, overview, trailer, cast and similar films; each
            actor shows a short biography and the movies they're known for.
          </p>
          <ul class="feature-list">
            <li><a routerLink="/movies">Popular movies</a>, updated daily by TMDB</li>
            <li><a routerLink="/actors">Popular actors</a> and their filmographies</li>
            <li>Search by title from the bar at the top</li>
            <li>Trailers right on the movie page</li>
          </ul>
        </div>
        <aside class="about-aside">
          <div class="credit-box">
            <h2 class="detail-label">Data source</h2>
            <p class="mb-0">
              Movie and actor data and images come from
              <a href="https://www.themoviedb.org/">The Movie Database (TMDB)</a>. This product
              uses the TMDB API but is not endorsed or certified by TMDB.
            </p>
          </div>
          <div class="credit-box">
            <h2 class="detail-label">Source code</h2>
            <p class="mb-0">
              Built with Angular and Bootstrap.
              <a href="https://github.com/Guaberx/TheMovieDBProject">View it on GitHub</a>.
            </p>
          </div>
        </aside>
      </div>
    </div>
  `,
})
export class About {}
