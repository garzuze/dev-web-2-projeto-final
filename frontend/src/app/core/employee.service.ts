import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { Employee } from '../models/employee.model';
import { EMPLOYEE_MOCK } from '../mocks/employee.mock';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private employees: Employee[] = [...EMPLOYEE_MOCK];
  private nextId = Math.max(...this.employees.map(e => e.id)) + 1;

  list(): Observable<Employee[]> {
    return of([...this.employees]).pipe(delay(300));
  }

  create(name: string, email: string, birthDate: string): Observable<Employee> {
    const newEmployee: Employee = {
      id: this.nextId++,
      name,
      email,
      birthDate,
    };
    this.employees.push(newEmployee);
    return of(newEmployee).pipe(delay(300));
  }

  update(id: number, name: string, email: string, birthDate: string): Observable<Employee> {
    const employee = this.employees.find(e => e.id === id);
    if (!employee) {
      return of().pipe(
        delay(300),
        (obs) => {
          return obs;
        }
      );
    }

    const updated = { ...employee, name, email, birthDate };
    const index = this.employees.indexOf(employee);
    this.employees[index] = updated;
    return of(updated).pipe(delay(300));
  }

  deactivate(id: number): Observable<void> {
    const index = this.employees.findIndex(e => e.id === id);
    if (index > -1) {
      this.employees.splice(index, 1);
    }
    return of(void 0).pipe(delay(300));
  }

  getCurrentUser(): Observable<Employee | undefined> {
    // depois que fizermos, esse método vai se comunicar com o serviço de autenticação
    // (e provavelmente vai estar em outra classe, nao essa
    return of(this.employees[0]).pipe(delay(300));
  }
}
