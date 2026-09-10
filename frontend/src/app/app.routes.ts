import { SolicitacaoServicoCliente } from './solicitacao-servico-cliente/solicitacao-servico-cliente';
import { LoginComponent } from './login/login.component';
import { QuoteComponent } from './pages/client/quote/';
import { PaymentComponent } from './pages/client/payment';
import { Routes } from '@angular/router';
import { LandingPage } from './landing-page/landing-page';
import { Autocadastro } from './autocadastro/autocadastro';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { CategoriesComponent } from './pages/employee/categories';
import { employeeGuard } from './core/employee.guard';

export const routes: Routes = [
  { path: '', component: LandingPage },
  { path: 'login', component: LoginComponent },
  { path: 'autocadastro', component: Autocadastro },
  { path: 'client/request', component: SolicitacaoServicoCliente },
  { path: 'client/quote/:id', component: QuoteComponent },
  { path: 'client/payment/:id', component: PaymentComponent },
  {
    path: 'employee/categories',
    component: CategoriesComponent,
    canActivate: [employeeGuard],
  },
  { path: '**', component: NotFoundComponent },
];
