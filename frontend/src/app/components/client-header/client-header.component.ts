import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map } from 'rxjs';

import { AuthService, LoginResponse } from '../../core/auth.service';

@Component({
  imports: [RouterLink],
  selector: 'app-client-header',
  templateUrl: './client-header.component.html',
  host: { class: 'sticky top-0 z-50 block' },
})
export class ClientHeaderComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  private readonly path = computed(() => this.url().split(/[?#]/)[0]);

  readonly isNewRequestActive = computed(() => this.path() === '/client/request/new');

  readonly isMyRequestsActive = computed(
    () => !this.isNewRequestActive() && /^\/client\/(request|quote|payment)(\/|$)/.test(this.path()),
  );

  get currentUser(): LoginResponse | null {
    return this.auth.currentUser;
  }

  get initials(): string {
    const parts = (this.currentUser?.name ?? '').trim().split(/\s+/);
    const first = parts.at(0) ?? '';
    const last = parts.length > 1 ? (parts.at(-1) ?? '') : '';
    return (first.charAt(0) + last.charAt(0)).toUpperCase();
  }

  onLogout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
