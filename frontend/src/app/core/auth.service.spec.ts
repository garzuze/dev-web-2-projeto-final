import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { AuthService, LoginResponse } from './auth.service';

const LOGGED_USER_KEY = 'manutencao.loggedUser';

const employee: LoginResponse = {
  id: 1,
  name: 'Maria Silva',
  email: 'maria@teste.com',
  profile: 'EMPLOYEE',
};

describe('AuthService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
  });

  it('should be created', () => {
    expect(TestBed.inject(AuthService)).toBeTruthy();
  });

  it('should store the logged user', () => {
    TestBed.inject(AuthService).setLoggedUser(employee);

    expect(JSON.parse(localStorage.getItem(LOGGED_USER_KEY) ?? 'null')).toEqual(employee);
  });

  it('should restore the logged user from a previous session', () => {
    localStorage.setItem(LOGGED_USER_KEY, JSON.stringify(employee));

    expect(TestBed.inject(AuthService).currentUser).toEqual(employee);
  });

  it('should forget the logged user on logout', () => {
    const service = TestBed.inject(AuthService);
    service.setLoggedUser(employee);

    service.logout();

    expect(service.currentUser).toBeNull();
    expect(localStorage.getItem(LOGGED_USER_KEY)).toBeNull();
  });

  it('should ignore a corrupted stored user', () => {
    localStorage.setItem(LOGGED_USER_KEY, 'nao e json');

    expect(TestBed.inject(AuthService).currentUser).toBeNull();
    expect(localStorage.getItem(LOGGED_USER_KEY)).toBeNull();
  });
});
