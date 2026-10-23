import { Component } from '@angular/core';

// Fills the screen so the footer stays below the fold until the content arrives.
@Component({
  selector: 'app-loading',
  template: `
    <div class="d-flex justify-content-center padtop-6 vh-100">
      <div class="spinner-border loading-spinner" role="status">
        <span class="visually-hidden">Loading…</span>
      </div>
    </div>
  `,
})
export class Loading {}
