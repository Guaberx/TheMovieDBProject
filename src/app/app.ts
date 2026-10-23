import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './shared/footer/footer';
import { Nav } from './shared/nav/nav';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Nav, Footer],
  template: `
    <section>
      <app-nav />
      <main>
        <router-outlet />
      </main>
      <app-footer />
    </section>
  `,
})
export class App {}
