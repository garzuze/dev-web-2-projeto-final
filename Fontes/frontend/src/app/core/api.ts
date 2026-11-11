import { HttpErrorResponse } from '@angular/common/http';

/** Base da API do backend Spring. */
export const API_URL = 'http://localhost:8080/api';

/** Corpo de erro que o backend devolve (ProblemDetail, RFC 7807). */
export interface ProblemDetail {
  status: number;
  detail?: string;
  fields?: Record<string, string>;
}

export function problemMessage(
  err: HttpErrorResponse,
  fallback: string,
): string {
  const problem = err.error as ProblemDetail | null;
  if (problem?.fields) {
    const firstFieldMessage = Object.values(problem.fields)[0];
    if (firstFieldMessage) {
      return firstFieldMessage;
    }
  }
  return (err.error as ProblemDetail | null)?.detail ?? fallback;
}
