import { Component } from '@angular/core';

@Component({
  selector: 'app-tutorial',
  template: `
    <div class="padtop-6 pb-5">
      <video controls class="d-block mx-auto mw-100" width="700">
        <source src="Tutorial.webm" type="video/webm" />
      </video>
    </div>
  `,
})
export class Tutorial {}
