import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  template: `
    <svg height="100vh" width="100%" role="img" aria-label="Error 404: page not found">
      <text
        x="50%"
        y="30vh"
        font-size="8vw"
        fill="white"
        text-anchor="middle"
        dominant-baseline="central"
      >
        Error 404
        <tspan x="50%" y="50vh" font-size="6vw">Page not found</tspan>
      </text>
    </svg>
  `,
})
export class NotFound {}
