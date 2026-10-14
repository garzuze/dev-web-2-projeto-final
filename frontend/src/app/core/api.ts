import { HttpErrorResponse } from "@angular/common/http";

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
  return (err.error as ProblemDetail | null)?.detail ?? fallback;
}
