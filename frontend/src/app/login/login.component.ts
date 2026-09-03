import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../core/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './login.component.html'
})
export class LoginComponent {
    private readonly auth = inject(AuthService);
    private readonly router = inject(Router);

    loginData = {
        email: '',
        password: ''
    };

    // signals: o refresh da tela nao depende do change detection do zone.js
    readonly loading = signal(false);
    readonly errorMessage = signal('');

    onSubmit() {
        if (!this.loginData.email || !this.loginData.password) {
            return;
        }

        this.loading.set(true);
        this.errorMessage.set('');

        this.auth.login(this.loginData).subscribe({
            next: (user) => {
                this.loading.set(false);
                this.auth.setLoggedUser(user);
                // RF002: o proprio backend diz o perfil, o front so encaminha
                this.router.navigate([user.profile === 'EMPLOYEE' ? '/' : '/solicitacao-servico-cliente']);
            },
            error: (error: HttpErrorResponse) => {
                this.loading.set(false);
                this.errorMessage.set(this.messageFor(error));
            }
        });
    }

    private messageFor(error: HttpErrorResponse): string {
        if (error.status === 0) {
            return 'Não foi possível falar com o servidor. Confira se o backend está rodando.';
        }
        return error.error?.detail ?? 'Não foi possível entrar. Tente novamente.';
    }
}
