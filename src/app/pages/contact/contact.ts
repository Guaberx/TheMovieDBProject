import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  template: `
    <div class="container padtop-6 pb-5">
      <div class="profile">
        <img class="profile-photo" src="profile.jfif" alt="Juan Fernando Otoya" />
        <div>
          <h1 class="h3 text-white mb-1"><b>Juan Fernando Otoya</b></h1>
          <p class="profile-role">Developer of MoviesApp</p>
          <ul class="feature-list">
            <li>Computer science, Pontificia Universidad Javeriana Cali</li>
            <li>Built MoviesApp with Angular</li>
          </ul>
        </div>
      </div>
    </div>
  `,
})
export class Contact {}
