import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from './auth.service';

/**
 * ponytail: o AuthService guarda o usuario so em memoria, entao um F5 cai no
 * login. Persistir a sessao e trabalho do [S6][P5].
 */
export const employeeGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return auth.currentUser?.profile === 'EMPLOYEE' || inject(Router).createUrlTree(['/login']);
};
