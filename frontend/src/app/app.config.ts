import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import localePtExtra from '@angular/common/locales/extra/pt';
import { routes } from './app.routes';

// Necessario para que DatePipe/CurrencyPipe/DecimalPipe formatem em pt-BR,
// como exige o requisito nao-funcional de datas e valores no formato brasileiro.
registerLocaleData(localePt, 'pt-BR', localePtExtra);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // Os interceptors (token de autenticacao, tratamento de erro) entram na
    // lista abaixo conforme forem criados em src/app/core/interceptors.
    provideHttpClient(withInterceptors([])),
    { provide: LOCALE_ID, useValue: 'pt-BR' },
  ],
};
