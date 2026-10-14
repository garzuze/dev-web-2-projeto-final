import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { API_URL } from './api';

export const currentUserInterceptor: HttpInterceptorFn = (req, next) => {
  const user = inject(AuthService).currentUser;
  if (!user || !req.url.startsWith(API_URL)) {
    return next(req);
  }
  return next(
    req.clone({ setHeaders: { 'X-Current-User-Id': String(user.id) } }),
  );
};
