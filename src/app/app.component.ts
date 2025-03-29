import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  template: `
  <div class="min-h-screen bg-white dark:bg-dark-900">
    <app-header />
    <main>
      <router-outlet />
    </main>
  </div>
  `
})
export class AppComponent {
}