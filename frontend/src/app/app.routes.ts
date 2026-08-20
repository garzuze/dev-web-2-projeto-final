import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { QuoteComponent } from './budget/quote';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'quote', component: QuoteComponent },
];
