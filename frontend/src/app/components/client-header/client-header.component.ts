import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService, LoginResponse } from '../../core/auth.service';

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-client-header',
  templateUrl: './client-header.component.html',
})
export class ClientHeaderComponent {
  private readonly auth = inject(AuthService);

  get currentUser(): LoginResponse | null {
    return this.auth.currentUser;
  }

  get initials(): string {
    const parts = (this.currentUser?.name ?? '').trim().split(/\s+/);
    const first = parts.at(0) ?? '';
    const last = parts.length > 1 ? (parts.at(-1) ?? '') : '';
    return (first.charAt(0) + last.charAt(0)).toUpperCase();
  }
}
