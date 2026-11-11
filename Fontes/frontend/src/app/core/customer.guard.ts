import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from './auth.service';

export const customerGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return (
    auth.currentUser?.profile === 'CUSTOMER' ||
    inject(Router).createUrlTree(['/login'])
  );
};
