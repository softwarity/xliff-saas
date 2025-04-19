import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { InjectionToken, PLATFORM_ID, inject } from '@angular/core';

/**
 * Function to determine the base URL of the application,
 * taking into account the <base> tag if present.
 * Normalized to always end with a slash.
 */
export function baseUrlFactory(): string {
  const platformId: Object = inject(PLATFORM_ID);
  if (isPlatformBrowser(platformId)) {
    const document = inject(DOCUMENT);
    const baseElement = document.querySelector('base') || document.querySelector('#base');
    const baseUrl = baseElement?.getAttribute('href') || window.location.origin;
    return baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  }
  return '';
}

/**
 * Token that provides the base URL of the application.
 * The URL is normalized to always end with a slash.
 */
export const BASE_URL = new InjectionToken<string>('BASE_URL', {
  factory: baseUrlFactory,
  providedIn: 'root'
}); 