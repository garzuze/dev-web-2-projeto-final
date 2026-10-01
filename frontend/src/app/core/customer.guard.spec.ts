import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
  provideRouter,
} from '@angular/router';

import { AuthService, LoginResponse } from './auth.service';
import { customerGuard } from './customer.guard';

const runGuard = () =>
  TestBed.runInInjectionContext(() =>
    customerGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
  );

const user = (
  profile: LoginResponse['profile'],
  name: string,
): LoginResponse => ({
  id: 1,
  name,
  email: 'teste@teste.com',
  profile,
});

describe('customerGuard', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideRouter([])],
    });
  });

  it('should allow a logged customer', () => {
    TestBed.inject(AuthService).setLoggedUser(
      user('CUSTOMER', 'João da Silva'),
    );

    expect(runGuard()).toBe(true);
  });

  it('should redirect to login when nobody is logged', () => {
    const result = runGuard() as UrlTree;

    expect(TestBed.inject(Router).serializeUrl(result)).toBe('/login');
  });

  it('should redirect to login when the profile is EMPLOYEE', () => {
    TestBed.inject(AuthService).setLoggedUser(user('EMPLOYEE', 'Maria Silva'));
    const result = runGuard() as UrlTree;

    expect(TestBed.inject(Router).serializeUrl(result)).toBe('/login');
  });
});
