import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { delay, Observable, timeout } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { RequestService } from './core/services/request.service';

export function requestInterceptorService(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const requestService = inject(RequestService);
  const time_out: number = parseInt(req.headers.get('timeout') || '5000', 10);
  const postDelay: number = parseInt(req.headers.get('postDelay') || '0', 10);
  const noFreeze: boolean = req.headers.get('noFreeze') === 'true';
  const noCache: boolean = req.headers.get('noCache') === 'true';
  const url: string = req.url;
  if (!noFreeze) {
    requestService.push(url);
  }
  if (noCache) {
    const salt = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    req = req.clone({
      setParams: {salt}
    });
  }
  return next(req).pipe(
    timeout(time_out),
    delay(postDelay),
    finalize(() => !noFreeze ? requestService.remove(url) : null)
  );
}
