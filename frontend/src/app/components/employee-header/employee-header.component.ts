import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '../../core/auth.service';

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-employee-header',
  templateUrl: './employee-header.component.html',
  styleUrl: './employee-header.component.scss',
})
export class EmployeeHeaderComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  onLogout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
