/// <reference types="@angular/localize" />

import { provideHttpClient } from '@angular/common/http';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withViewTransitions } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withViewTransitions()),
    provideHttpClient(),
    provideAnimations(),
    provideExperimentalZonelessChangeDetection()
  ]
}).catch(err => {
    console.error('Detailed bootstrap error:', err);
    // Log the full error stack
    if (err.stack) {
      console.error('Error stack:', err.stack);
    }
    // Log any additional error details
    if (err.ngDebugContext) {
      console.error('Angular Debug Context:', err.ngDebugContext);
    }
    document.body.innerHTML = `
      <div style="color: red; padding: 20px;">
        An error occurred while starting the application.
        Please try again or contact support if the problem persists.
        <pre style="margin-top: 10px; font-size: 12px;">${err.message}</pre>
      </div>
    `;
  });