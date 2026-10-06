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
export class CategoryService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_URL}/reports`;

  revenue(start: string, end:string): Observable<>{

  }
}
