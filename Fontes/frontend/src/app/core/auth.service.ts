import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_URL } from './api';

export type UserProfile = 'CUSTOMER' | 'EMPLOYEE';

export interface LoginRequest {
  email: string;
  password: string;
}

/** Espelha o LoginResponse do backend (RF002). */
export interface LoginResponse {
  id: number;
  name: string;
  email: string;
  profile: UserProfile;
}

export interface Address {
  zipCode: string;
  state: string;
  city: string;
  district: string;
  street: string;
  number: string;
  complement?: string;
}

export interface SignUpRequest {
  cpf: string;
  name: string;
  email: string;
  phone: string;
  address: Address;
}

export interface SignUpResponse {
  id: number;
  name: string;
  email: string;
}

const LOGGED_USER_KEY = 'manutencao.loggedUser';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  private loggedUser: LoginResponse | null = this.readStoredUser();

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${API_URL}/auth/login`, request);
  }

  /** Guarda quem entrou para as telas seguintes saberem o perfil. */
  setLoggedUser(user: LoginResponse | null) {
    this.loggedUser = user;
    if (user) {
      localStorage.setItem(LOGGED_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(LOGGED_USER_KEY);
    }
  }

  logout() {
    this.setLoggedUser(null);
  }

  private readStoredUser(): LoginResponse | null {
    const stored = localStorage.getItem(LOGGED_USER_KEY);
    if (!stored) {
      return null;
    }
    try {
      return JSON.parse(stored) as LoginResponse;
    } catch {
      localStorage.removeItem(LOGGED_USER_KEY);
      return null;
    }
  }

  get currentUser(): LoginResponse | null {
    return this.loggedUser;
  }

  signUp(request: SignUpRequest): Observable<SignUpResponse> {
    return this.http.post<SignUpResponse>(`${API_URL}/auth/sign-up`, request);
  }
}
