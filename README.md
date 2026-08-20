# Projeto final de desenvolvimento web 2

Sistema de Controle de Manutenção de Equipamentos — UFPR / SEPT / TADS.

## Versões

| Ferramenta  | Versão               |
| ----------- | -------------------- |
| Node.js     | v24.19.0 (LTS)       |
| Java (JDK)  | 25.0.4+7 (LTS)       |
| Angular     | 21.2.21              |
| Spring Boot | 4.1.0                |
| PostgreSQL  | —                    |

## Estrutura

```
frontend/   Angular 21 (standalone, tailwind, sem SSR)
backend/    Spring Boot 4.1 (Maven, Java 25)
```

## Rodando

```bash
cd frontend && npm start      # http://localhost:4200
cd backend  && ./mvnw spring-boot:run
```
