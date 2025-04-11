import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, HeaderComponent],
  styles: [`
    a {
      @apply text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary;
    }
  `],
  template: `
  <div class="min-h-screen bg-white dark:bg-dark-900 flex flex-col">
    <app-header />
    <main class="flex-1">
      <router-outlet />
    </main>
    <footer class="border-t border-gray-200 dark:border-gray-800 py-6">
      <div class="container mx-auto px-4">
        <div class="flex flex-wrap justify-center gap-x-6 gap-y-2">
          <a href="https://softwarity.io" target="_blank"  i18n="@@FOOTER_COPYRIGHT">© 2025 Softwarity, Inc.</a>
          <a routerLink="/terms" i18n="@@FOOTER_TERMS">Terms of Service</a>
          <a routerLink="/privacy" i18n="@@FOOTER_PRIVACY">Privacy Policy</a>
          <a routerLink="/documentation" i18n="@@FOOTER_DOCS">Docs</a>
          <a href="#" i18n="@@FOOTER_CONTACT">Contact</a>
          <a href="#" i18n="@@FOOTER_COOKIES">Manage cookies</a>
        </div>
      </div>
    </footer>
  </div>
  `
})
export class AppComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    // Gérer les query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page');
    this.router.navigateByUrl(`/${page}`);

    // Gérer la redirection GitHub
    const redirect = localStorage.getItem('gh-redirect');
    if (redirect) {
      localStorage.removeItem('gh-redirect');
      this.router.navigateByUrl(redirect);
    }
  }
}