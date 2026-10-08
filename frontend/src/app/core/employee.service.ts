import { inject, Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { Employee } from '../models/employee.model';
import { EMPLOYEE_MOCK } from '../mocks/employee.mock';
import { HttpClient } from '@angular/common/http';
import { API_URL } from './api';
import { Category } from './category.service';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private employees: Employee[] = [...EMPLOYEE_MOCK];
  private readonly http = inject(HttpClient);
  private readonly url = `${API_URL}/employees`;

  list(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.url);
  }

  create(name: string, email: string, birthDate: string): Observable<Employee> {
    const newEmployee: Omit<Employee, 'id'> = {
      name,
      email,
      birthDate,
    };

    return this.http.post<Employee>(this.url, newEmployee);
  }

  update(
    id: number,
    name: string,
    email: string,
    birthDate: string,
  ): Observable<Employee | null> {
    const employee = this.employees.find((e) => e.id === id);
    // TODO: jogar exceção aqui ao invés de null
    if (!employee) {
      return of(null);
    }

    const updated = { ...employee, name, email, birthDate };
    return this.http.put<Employee>(`${this.url}/${id}`, updated);
  }

  deactivate(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  findById(id: number): Observable<Employee | null> {
    return this.http.get<Employee>(`${this.url}/${id}`);
  }
}
