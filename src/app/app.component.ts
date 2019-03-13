import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  // templateUrl: './app.component.html',
  template: `
    <div>
      <h1>{{ title }}</h1>
      <app-product-list>My First Component</app-product-list>
    </div>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'demo-app';
}
