import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './login.component.html'
})
export class LoginComponent {
    loginData = {
        email: '',
        password: ''
    };

    onSubmit() {
        console.log('Tentativa de acesso com dados:', this.loginData);

        if (this.loginData.email && this.loginData.password) {
            alert('nao ta mais feio pq temo tailwind agora mais ainda nao tem uma tela para mandar o user kkk :) .');
        } else {
            alert('Parabens vc sabe usar devtools ! :)');
        }
    }
}
