import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  template: `
    <div class="container padtop-6 pb-5">
      <div class="row">
        <div class="col-md-auto">
          <div class="poster big">
            <img src="profile.jfif" alt="Creator's profile picture" />
          </div>
        </div>
        <div class="col">
          <h3 class="text-white"><b>MovieApp</b></h3>
          <br />
          <p>
            Developed by: <b>Juan Fernando Otoya</b><br />Using Angular.<br /><br />Description:
          </p>
          <ul class="text-white">
            <li>Background: Computer science student</li>
            <li>University: Pontificia Universidad Javeriana Cali</li>
            <li>Born in 1997</li>
          </ul>
        </div>
      </div>
    </div>
  `,
})
export class Contact {}
