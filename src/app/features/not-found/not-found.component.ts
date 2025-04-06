import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="not-found-container">
      <div class="content">
        <h1>404</h1>
        <div class="glitch-text" i18n="@@PAGE_NOT_FOUND">Page Not Found</div>
        <p i18n="@@OOPS_PAGE_NOT_FOUND">Oops! The page you're looking for seems to have vanished into the void...</p>
        <button routerLink="/" class="flat-primary" i18n="@@NOT_FOUND_BACK_HOME">
          Back to Home
        </button>
      </div>
    </div>
  `,
  styles: [`
    .not-found-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 2rem;
      background: var(--background-color);
      color: var(--text-color);
    }

    .content {
      text-align: center;
      max-width: 600px;
    }

    h1 {
      font-size: 8rem;
      margin: 0;
      color: var(--primary-color);
      text-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
      animation: pulse 2s infinite;
    }

    .glitch-text {
      font-size: 2rem;
      font-weight: bold;
      margin: 1rem 0;
      position: relative;
      color: var(--text-color);
    }

    .glitch-text::before,
    .glitch-text::after {
      content: 'Page Not Found';
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      opacity: 0.8;
    }

    .glitch-text::before {
      animation: glitch 0.3s cubic-bezier(.25, .46, .45, .94) both infinite;
      color: var(--primary-color);
      clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%);
      transform: translate(-4px, -4px);
    }

    .glitch-text::after {
      animation: glitch 0.3s cubic-bezier(.25, .46, .45, .94) reverse both infinite;
      color: var(--accent-color);
      clip-path: polygon(0 65%, 100% 65%, 100% 100%, 0 100%);
      transform: translate(4px, 4px);
    }

    p {
      margin: 2rem 0;
      font-size: 1.2rem;
      opacity: 0.8;
    }

    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }

    @keyframes glitch {
      0% { transform: translate(0); }
      20% { transform: translate(-2px, 2px); }
      40% { transform: translate(-2px, -2px); }
      60% { transform: translate(2px, 2px); }
      80% { transform: translate(2px, -2px); }
      100% { transform: translate(0); }
    }
  `]
})
export class NotFoundComponent {}
