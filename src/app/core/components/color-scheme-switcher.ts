import { isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-color-scheme-switcher',
  standalone: true,
  template: `
    <button (click)="toggleColorScheme()" class="icon flat-ghost" i18n-title="@@TOGGLE_COLOR_SCHEME" title="Toggle color scheme" aria-label="Toggle color scheme">
      <svg class="w-5 h-5 hidden dark:inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
      </svg>
      <svg class="w-5 h-5 inline dark:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
      </svg>
    </button>
  `
})
export class ColorSchemeSwitcherComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    this.initializeTheme();
    this.setupSystemThemeListener();
  }

  toggleColorScheme() {
    if (isPlatformBrowser(this.platformId)) {
      const systemColorScheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      const root = document.documentElement;
      const nextColorScheme = !root.classList.contains('dark') ? 'dark' : 'light';
      if (nextColorScheme === systemColorScheme) {
        this.setColorScheme('system');
      } else {
        this.setColorScheme(nextColorScheme);
      }
    }
  }

  setColorScheme(scheme: 'system' | 'dark' | 'light') {
    if (isPlatformBrowser(this.platformId)) {
      const root = document.documentElement;
      root.classList.toggle('dark', false)
      if (scheme === 'system') {
        const color = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        this.setColor(color);
        localStorage.setItem('color-scheme', 'system');
      } else {
        this.setColor(scheme);
        localStorage.setItem('color-scheme', scheme);
      }
    }
  }

  setColor(color: string) {
    if (isPlatformBrowser(this.platformId)) {
      const root = document.documentElement;
      root.classList.toggle('dark', color === 'dark');
    }
  }

  initializeTheme() {
    if (isPlatformBrowser(this.platformId)) {
      const savedScheme: 'system' | 'dark' | 'light' = localStorage.getItem('color-scheme') as 'system' | 'dark' | 'light' || 'system';
      this.setColorScheme(savedScheme);
    }
  }

  setupSystemThemeListener() {
    if (isPlatformBrowser(this.platformId)) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        const currentScheme = localStorage.getItem('color-scheme') || 'system';
        if (currentScheme === 'system') {
          this.setColorScheme('system');
        }
      });
    }
  }
}