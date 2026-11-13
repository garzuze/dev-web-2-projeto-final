import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { API_URL } from './api';

export const currentUserInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const user = auth.currentUser;
  if (!user || !req.url.startsWith(API_URL)) {
    return next(req);
  }
  return next(
    req.clone({
      setHeaders: {
        'X-Current-User-Id': String(user.id),
        Authorization: `Bearer ${user.token}`,
      },
    }),
  ).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        auth.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    }),
  );
};
