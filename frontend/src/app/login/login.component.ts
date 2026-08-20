import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule],
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
            alert('ta feio eu sei mas quando decidir qual framework de css usar vai melhorar.');
        } else {
            alert('Parabens vc sabe usar devtools ! :)');
        }
    }
}
