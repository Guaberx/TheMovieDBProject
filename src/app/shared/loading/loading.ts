import { Component } from '@angular/core';

@Component({
  selector: 'app-loading',
  template: `
    <div class="d-flex justify-content-center padtop-6">
      <div class="spinner-border loading-spinner" role="status">
        <span class="visually-hidden">Loading…</span>
      </div>
    </div>
  `,
})
export class Loading {}
