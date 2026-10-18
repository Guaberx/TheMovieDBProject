import { Component } from '@angular/core';

@Component({
  selector: 'app-tutorial',
  template: `
    <div class="padtop-6 pb-5">
      <h1 class="visually-hidden">Tutorial</h1>
      <!-- The video is 58 MB, so only its metadata loads until it's played. -->
      <video controls preload="metadata" class="d-block mx-auto mw-100" width="700">
        <source src="Tutorial.webm" type="video/webm" />
      </video>
    </div>
  `,
})
export class Tutorial {}
