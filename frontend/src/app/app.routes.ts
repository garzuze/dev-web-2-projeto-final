import { LoginComponent } from './login/login.component';
import { HomeComponent } from './pages/client/home';
import { QuoteComponent } from './pages/client/quote/';
import { PaymentComponent } from './pages/client/payment';
import { NewRequestComponent } from './pages/client/new-request';
import { RequestDetailComponent } from './pages/client/request-detail/request-detail.component';
import { Routes } from '@angular/router';
import { LandingPage } from './landing-page/landing-page';
import { Autocadastro } from './autocadastro/autocadastro';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { CategoriesComponent } from './pages/employee/categories';
import { employeeGuard } from './core/employee.guard';
import { HomeEmployeeComponent } from './pages/employee/home/home-employee.component';
import { QuoteFormComponent } from './pages/employee/quote-form/quote-form.component';
import { RequestListComponent } from './pages/employee/request-list/request-list.component';

export const routes: Routes = [
  { path: '', component: LandingPage },
  { path: 'login', component: LoginComponent },
  { path: 'autocadastro', component: Autocadastro },
  { path: 'client/request', component: HomeComponent },
  { path: 'client/request/new', component: NewRequestComponent },
  { path: 'client/request/:id', component: RequestDetailComponent },
  { path: 'client/quote/:id', component: QuoteComponent },
  { path: 'client/payment/:id', component: PaymentComponent },
  {
    path: 'employee/categories',
    component: CategoriesComponent,
    //canActivate: [employeeGuard],
  },
  {
    path: 'employee/quote/:id',
    component: QuoteFormComponent,
  },
  {
    path: 'employee/home',
    component: HomeEmployeeComponent,
  },
  {
    path: 'employee/requests',
    component: RequestListComponent,
  },
  { path: 'employee', redirectTo: 'employee/home', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent },
];
