import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee.model';
import { HttpClient } from '@angular/common/http';
import { API_URL } from './api';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
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
  ): Observable<Employee> {
    const updated = { name, email, birthDate };
    return this.http.put<Employee>(`${this.url}/${id}`, updated);
  }

  deactivate(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

}
