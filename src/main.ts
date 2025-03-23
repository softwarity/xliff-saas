/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
console.log('Starting application bootstrap...');

bootstrapApplication(AppComponent, appConfig)
  .then(() => {
    console.log('Application successfully bootstrapped');
  })
  .catch(err => {
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