import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
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
export class AppComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    const redirect = localStorage.getItem('gh-redirect');
    if (redirect) {
      console.log('redirect', redirect);
      localStorage.removeItem('gh-redirect');
      this.router.navigateByUrl(redirect);
    }
  }
}