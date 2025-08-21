import {
  HttpInterceptorFn,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { of, throwError, Observable } from 'rxjs';
import { tap, catchError, startWith } from 'rxjs/operators';

type CacheEntry = { etag?: string; lastModified?: string; body: any };
const etagCache = new Map<string, CacheEntry>();

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('subSfTk')?.replace(/^"(.*)"$/, '$1');

  let authReq = req;
  if (token) {
    authReq = authReq.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  const cacheKey = authReq.urlWithParams;
  const cached = etagCache.get(cacheKey);

  // Attach If-None-Match / If-Modified-Since
  if (cached?.etag || cached?.lastModified) {
    let headers: Record<string, string> = {};
    if (cached.etag) headers['If-None-Match'] = cached.etag;
    if (cached.lastModified) headers['If-Modified-Since'] = cached.lastModified;
    authReq = authReq.clone({ setHeaders: headers });
  }

  // Network request
  const network$ = next(authReq).pipe(
    tap((event) => {
      if (event instanceof HttpResponse && event.status === 200) {
        const etag = event.headers.get('ETag') || undefined;
        const lastModified = event.headers.get('Last-Modified') || undefined;
        etagCache.set(cacheKey, { etag, lastModified, body: event.body });
      }
    }),
    catchError((err: HttpErrorResponse) => {
      if (err.status === 304 && cached) {
        // No change, just use cached
        return of(
          new HttpResponse({
            body: cached.body,
            status: 200,
            statusText: 'OK (from cache)',
            url: authReq.url,
          })
        );
      }
      return throwError(() => err);
    })
  );

  // Serve cached immediately if available, then network result
  if (cached) {
    return network$.pipe(
      startWith(
        new HttpResponse({
          body: cached.body,
          status: 200,
          statusText: 'OK (stale cache)',
          url: authReq.url,
        })
      )
    );
  }

  return network$;
};
