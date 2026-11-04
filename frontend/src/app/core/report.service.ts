import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from './api';

export interface DailyRevenue {
  day: string;
  total: number;
}

export interface RevenueReport {
  start: string | null;
  end: string | null;
  days: DailyRevenue[];
  total: number;
}

export interface CategoryRevenue {
  name: string;
  total: number;
}

export interface CategoryRevenueReport {
  categories: CategoryRevenue[];
  total: number;
}

@Injectable({ providedIn: 'root' })
export class ReportService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_URL}/reports`;

  revenueByDay(start: string | null, end:string | null): Observable<RevenueReport>{
    let params = new HttpParams();
    if (start) params = params.set('start', start);
    if (end) params = params.set('end', end);

    return this.http.get<RevenueReport>(`${this.url}/revenue`, { params });
  }

  revenueByCategory(): Observable<CategoryRevenueReport> {
    return this.http.get<CategoryRevenueReport>(`${this.url}/revenue-by-category`);
  }

}
