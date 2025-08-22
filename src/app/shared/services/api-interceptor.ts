import {
  HttpInterceptorFn,
  HttpResponse,
  HttpErrorResponse,
  HttpRequest,
} from '@angular/common/http';
import { of, throwError, switchMap, catchError, tap, startWith } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Authservice } from '../../auth/shared/services/authservice';

type CacheEntry = { etag?: string; lastModified?: string; body: any };
const etagCache = new Map<string, CacheEntry>();

// store refresh in localStorage as well
const ACCESS_TOKEN_KEY = 'subSfTk';
const REFRESH_TOKEN_KEY = 'subSfRTk';

function getToken(): string | null {
  return (
    localStorage.getItem(ACCESS_TOKEN_KEY)?.replace(/^"(.*)"$/, '$1') || null
  );
}

function getRefreshToken(): string | null {
  return (
    localStorage.getItem(REFRESH_TOKEN_KEY)?.replace(/^"(.*)"$/, '$1') || null
  );
}

function setTokens(access: string, refresh: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, access);
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
}

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const token = getToken();
  const authService = inject(Authservice);
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

  // ---- Core network logic ----
  const network$ = next(authReq).pipe(
    tap((event) => {
      if (event instanceof HttpResponse && event.status === 200) {
        const etag = event.headers.get('ETag') || undefined;
        const lastModified = event.headers.get('Last-Modified') || undefined;
        etagCache.set(cacheKey, { etag, lastModified, body: event.body });
      }
    }),
    // catchError((err: HttpErrorResponse) => {
    //   // Handle 304 (Not Modified) from server
    //   if (err.status === 304 && cached) {
    //     return of(
    //       new HttpResponse({
    //         body: cached.body,
    //         status: 200,
    //         statusText: 'OK (from cache)',
    //         url: authReq.url,
    //       })
    //     );
    //   }

    //   // Handle 401 → try refresh
    //   if (err.status === 401) {
    //     const refresh = getRefreshToken();

    //     if (refresh === null) {
    //       return throwError(() => err);
    //     }

    //     authService.refreshToken(refresh).subscribe({
    //       next: (res) => {
    //         const newAccess = res.access_token;
    //         const newRefresh = res.refresh_token;
    //         if (newAccess && newRefresh) {
    //           setTokens(newAccess, newRefresh);

    //           // retry original request with new token
    //           const retryReq = req.clone({
    //             setHeaders: { Authorization: `Bearer ${newAccess}` },
    //           });

    //           return next(retryReq);
    //         }
    //         return throwError(() => err);
    //       },
    //       error: (err) => {
    //         console.error('Refresh failed', err);
    //       },
    //     });

    //     // return http.post<any>('/auth/refresh', { refresh_token: refresh }).pipe(
    //     //   switchMap((res) => {
    //     //     const newAccess = res.access_token;
    //     //     const newRefresh = res.refresh_token;
    //     //     if (newAccess && newRefresh) {
    //     //       setTokens(newAccess, newRefresh);

    //     //       // retry original request with new token
    //     //       const retryReq = req.clone({
    //     //         setHeaders: { Authorization: `Bearer ${newAccess}` },
    //     //       });
    //     //       return next(retryReq);
    //     //     }
    //     //     return throwError(() => err);
    //     //   }),
    //     //   catchError(() => throwError(() => err))
    //     // );
    //   }

    //   return throwError(() => err);
    // })

    catchError((err: HttpErrorResponse) => {
      // Handle 304 (Not Modified)
      if (err.status === 304 && cached) {
        return of(
          new HttpResponse({
            body: cached.body,
            status: 200,
            statusText: 'OK (from cache)',
            url: authReq.url,
          })
        );
      }

      // Handle 401 → refresh token
      if (err.status === 401) {
        const refresh = getRefreshToken();

        if (!refresh) {
          return throwError(() => err);
        }

        // IMPORTANT: return the observable (not subscribe)
        return authService.refreshToken(refresh).pipe(
          switchMap((res) => {
            const newAccess = res.access_token;
            const newRefresh = res.refresh_token;

            if (newAccess && newRefresh) {
              setTokens(newAccess, newRefresh);

              // retry original request with new token
              const retryReq = req.clone({
                setHeaders: { Authorization: `Bearer ${newAccess}` },
              });
              return next(retryReq);
            }

            return throwError(() => err);
          }),
          catchError((refreshErr) => {
            console.error('Refresh failed', refreshErr);
            return throwError(() => refreshErr);
          })
        );
      }

      return throwError(() => err);
    })
  );

  // Serve cached immediately if available, then update with network result
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
