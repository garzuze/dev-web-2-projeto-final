import { SolicitacaoServicoCliente } from './solicitacao-servico-cliente/solicitacao-servico-cliente';
import { LoginComponent } from './login/login.component';
import { QuoteComponent } from './budget/quote';
import { Routes } from '@angular/router';
import { LandingPage } from './landing-page/landing-page';

export const routes: Routes = [
  { path: 'solicitacao-servico-cliente', component: SolicitacaoServicoCliente },
  { path: 'login', component: LoginComponent },
  { path: '', component: LandingPage },
  { path: 'quote', component: QuoteComponent }
];
