import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_URL } from './api';

export interface Category {
  id: number;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_URL}/categories`;

  list(): Observable<Category[]> {
    return this.http.get<Category[]>(this.url);
  }

  create(name: string): Observable<Category> {
    return this.http.post<Category>(this.url, { name });
  }

  update(id: number, name: string): Observable<Category> {
    return this.http.put<Category>(`${this.url}/${id}`, { name });
  }

  deactivate(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
