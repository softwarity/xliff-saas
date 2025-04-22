import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from "@angular/core";
import { provideClientHydration, withEventReplay } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideRouter, withViewTransitions } from "@angular/router";
import { routes } from "./app.routes";
import { requestInterceptorService } from "./request-interceptor.service";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withViewTransitions()),
    provideHttpClient(withInterceptors([requestInterceptorService])),
    provideAnimations(),
    provideExperimentalZonelessChangeDetection(), 
    provideClientHydration(withEventReplay()),
  ]
}