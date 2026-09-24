import { LoginComponent } from './login/login.component';
import { HomeComponent } from './pages/client/home';
import { QuoteComponent } from './pages/client/quote/';
import { PaymentComponent } from './pages/client/payment';
import { NewRequestComponent } from './pages/client/new-request';
import { RequestDetailComponent } from './pages/client/request-detail/request-detail.component';
import { Routes } from '@angular/router';
import { LandingPage } from './landing-page/landing-page';
import { SelfRegister } from './self-register/self-register.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { CategoriesComponent } from './pages/employee/categories';
import { EmployeesComponent } from './pages/employee/employees';
import { HomeEmployeeComponent } from './pages/employee/home';
import { QuoteFormComponent } from './pages/employee/quote-form/quote-form.component';
import { RequestListComponent } from './pages/employee/request-list/request-list.component';
import { customerGuard } from './core/customer.guard';
import { employeeGuard } from './core/employee.guard';

export const routes: Routes = [
  { path: '', component: LandingPage },
  { path: 'login', component: LoginComponent },
  { path: 'self-register', component: SelfRegister },
  {
    path: 'client/request',
    component: HomeComponent,
    canActivate: [customerGuard],
  },
  {
    path: 'client/request/new',
    component: NewRequestComponent,
    canActivate: [customerGuard],
  },
  {
    path: 'client/request/:id',
    component: RequestDetailComponent,
    canActivate: [customerGuard],
  },
  {
    path: 'client/quote/:id',
    component: QuoteComponent,
    canActivate: [customerGuard],
  },
  {
    path: 'client/payment/:id',
    component: PaymentComponent,
    canActivate: [customerGuard],
  },
  {
    path: 'employee/categories',
    component: CategoriesComponent,
    canActivate: [employeeGuard],
  },
  {
    path: 'employee/employees',
    component: EmployeesComponent,
    canActivate: [employeeGuard],
  },
  {
    path: 'employee/quote/:id',
    component: QuoteFormComponent,
    canActivate: [employeeGuard],
  },
  {
    path: 'employee/home',
    component: HomeEmployeeComponent,
    canActivate: [employeeGuard],
  },
  {
    path: 'employee/requests',
    component: RequestListComponent,
    canActivate: [employeeGuard],
  },
  { path: 'employee', redirectTo: 'employee/home', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent },
];
