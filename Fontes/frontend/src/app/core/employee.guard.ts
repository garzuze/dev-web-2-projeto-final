import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from './auth.service';

export const employeeGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return (
    auth.currentUser?.profile === 'EMPLOYEE' ||
    inject(Router).createUrlTree(['/login'])
  );
};
