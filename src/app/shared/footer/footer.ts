import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  template: `
    <footer class="page-footer">
      <div class="container footer-inner">
        <span>
          © 2019 <a routerLink="/">MoviesApp</a> · Developed by
          <a routerLink="/contact">Juan Fernando Otoya</a>
        </span>
        <span class="footer-credit">
          Movie data from
          <a href="https://www.themoviedb.org/">
            <img class="tmdb-logo" src="tmdb-logo.svg" alt="TMDB" width="82" height="11" />
          </a>
        </span>
      </div>
    </footer>
  `,
})
export class Footer {}
