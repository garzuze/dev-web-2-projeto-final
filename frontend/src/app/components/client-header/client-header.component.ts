import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService, LoginResponse } from '../../core/auth.service';

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-client-header',
  templateUrl: './client-header.component.html',
})
export class ClientHeaderComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  // Controla o estado do menu lateral
  isSidebarOpen: boolean = false;

  get currentUser(): LoginResponse | null {
    return this.auth.currentUser;
  }

  get initials(): string {
    const parts = (this.currentUser?.name ?? '').trim().split(/\s+/);
    const first = parts.at(0) ?? '';
    const last = parts.length > 1 ? (parts.at(-1) ?? '') : '';
    return (first.charAt(0) + last.charAt(0)).toUpperCase();
  }

  // Altera a abertura/fechamento do menu
  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  // Garante que feche ao clicar em um link (útil em mobile)
  closeSidebar(): void {
    this.isSidebarOpen = false;
  }

  onLogout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
