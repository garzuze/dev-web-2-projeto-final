import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from './api';

export interface DailyRevenue {
  day: string;
  total: number;
}

export interface RevenueReport {
  start: string;
  end: string;
  days: string[];
  total: number;
}

@Injectable({ providedIn: 'root' })
export class ReportService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_URL}/reports`;

  revenue(start: string, end:string): Observable<DailyRevenue[]>{
    return this.http.get<DailyRevenue[]>(`${this.url}/revenue`, {
      params: { start, end }
    });
  }
}
