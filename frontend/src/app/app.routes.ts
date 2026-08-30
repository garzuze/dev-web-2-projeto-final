import { SolicitacaoServicoCliente } from './solicitacao-servico-cliente/solicitacao-servico-cliente';
import { LoginComponent } from './login/login.component';
import { QuoteComponent } from './pages/client/quote/';
import { PaymentComponent } from './payment/payment';
import { Routes } from '@angular/router';
import { LandingPage } from './landing-page/landing-page';
import { Autocadastro } from './autocadastro/autocadastro';

export const routes: Routes = [
  { path: 'solicitacao-servico-cliente', component: SolicitacaoServicoCliente },
  { path: 'login', component: LoginComponent },
  { path: '', component: LandingPage },
  { path: 'quote/:id', component: QuoteComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'autocadastro', component: Autocadastro },
];
