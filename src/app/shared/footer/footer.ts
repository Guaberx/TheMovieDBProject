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
        <span>Movie data from <a href="https://www.themoviedb.org/">TMDB</a></span>
      </div>
    </footer>
  `,
})
export class Footer {}
