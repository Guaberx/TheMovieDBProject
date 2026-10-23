import { Component } from '@angular/core';

// Same layout as the movie and actor pages: photo on the left, details on the right.
@Component({
  selector: 'app-contact',
  template: `
    <div class="container padtop-6 pb-5 page-text">
      <div class="detail-header">
        <div class="poster big">
          <div class="poster-frame">
            <img class="profile-photo" src="profile.jfif" alt="Juan Fernando Otoya" />
          </div>
        </div>
        <div class="detail-info">
          <h1 class="detail-title">Juan Fernando Otoya</h1>
          <p class="detail-meta"><span>Developer of MoviesApp</span></p>
          <h2 class="detail-label">Education</h2>
          <p>Computer science, Pontificia Universidad Javeriana Cali</p>
          <h2 class="detail-label">This project</h2>
          <p>
            Built MoviesApp with Angular.
            <a href="https://github.com/Guaberx/TheMovieDBProject">Source code on GitHub</a>.
          </p>
        </div>
      </div>
    </div>
  `,
})
export class Contact {}
