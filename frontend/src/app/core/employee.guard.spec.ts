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
import { employeeGuard } from './employee.guard';

const runGuard = () =>
  TestBed.runInInjectionContext(() =>
    employeeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
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

describe('employeeGuard', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideRouter([])],
    });
  });

  it('should allow a logged employee', () => {
    TestBed.inject(AuthService).setLoggedUser(user('EMPLOYEE', 'Maria Silva'));

    expect(runGuard()).toBe(true);
  });

  it('should redirect to login when nobody is logged', () => {
    const result = runGuard() as UrlTree;

    expect(TestBed.inject(Router).serializeUrl(result)).toBe('/login');
  });

  it('should redirect to login when the profile is CUSTOMER', () => {
    TestBed.inject(AuthService).setLoggedUser(
      user('CUSTOMER', 'João da Silva'),
    );
    const result = runGuard() as UrlTree;

    expect(TestBed.inject(Router).serializeUrl(result)).toBe('/login');
  });
});
