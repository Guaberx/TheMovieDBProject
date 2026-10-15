import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  template: `
    <footer class="page-footer">
      <div class="text-center py-3">
        <span class="text-white">Developed by: </span>
        <a routerLink="/contact"><b>Juan Fernando Otoya</b></a>
      </div>
      <div class="text-center py-2">
        <span class="text-white">© 2019 Copyright:</span>
        <a routerLink="/"> MoviesApp.com</a>
      </div>
    </footer>
  `,
})
export class Footer {}
