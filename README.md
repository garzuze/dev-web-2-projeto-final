# Controle de Manutenção de Equipamentos

Trabalho final de **Desenvolvimento Web II** — UFPR / SEPT / TADS.

Sistema de solicitações de manutenção de equipamentos com dois perfis (Cliente e
Funcionário) e histórico completo de alteração de estados. O enunciado original
está em [`docs/enunciado.pdf`](docs/enunciado.pdf) e a leitura destrinchada dos
requisitos em [`docs/REQUISITOS.md`](docs/REQUISITOS.md).

## Stack

| Camada | Tecnologia | Versão |
| --- | --- | --- |
| Frontend | Angular (standalone, zone.js) + Tailwind CSS | 22.1.5 |
| Backend | Spring Boot (Spring MVC, Spring Data JPA) | 4.1.0 |
| Linguagem backend | Java | 21 (LTS) |
| Build backend | Maven (via `./mvnw`) | wrapper |
| Banco | PostgreSQL | 17 (local, via Homebrew) |
| Runtime frontend | Node.js | 24 (ver `.nvmrc`) |

## Estrutura do repositório

```
dev-web-2-projeto-final/
├── frontend/            aplicação Angular
│   ├── proxy.conf.json  redireciona /api -> http://localhost:8080 (evita CORS)
│   └── src/app/
│       ├── core/        serviços, guards, interceptors e models compartilhados
│       ├── features/    uma pasta por funcionalidade (é aqui que cada um trabalha)
│       └── shared/      componentes, pipes e diretivas reaproveitáveis
├── backend/             API REST Spring Boot
│   └── src/main/java/br/ufpr/tads/web2/manutencao/
│       ├── config/      configurações (CORS, beans, segurança)
│       ├── controller/  endpoints REST (@RestController)
│       ├── dto/         objetos de entrada/saída da API
│       ├── mapper/      conversão entidade <-> DTO
│       ├── model/       entidades JPA (@Entity)
│       ├── repository/  interfaces Spring Data (Repository)
│       ├── service/     regras de negócio
│       └── exception/   exceções de negócio e @RestControllerAdvice
├── docs/                enunciado, requisitos, divisão de tarefas, suposições
└── docker-compose.yml   PostgreSQL 17 + Adminer
```

## Pré-requisitos

- **Node.js 24** — com [nvm](https://github.com/nvm-sh/nvm): `nvm install 24 && nvm use`
  (o arquivo `.nvmrc` na raiz já fixa a versão)
- **JDK 21** — `brew install openjdk@21` (macOS) ou [Adoptium](https://adoptium.net/)
- **PostgreSQL 17** — `brew install postgresql@17` (macOS) ou [postgresql.org](https://www.postgresql.org/download/)

### Configurando o JDK 21 no macOS (Homebrew)

O Homebrew não coloca o JDK no PATH automaticamente. Adicione ao seu `~/.zshrc`:

```sh
export JAVA_HOME="$(brew --prefix openjdk@21)"
export PATH="$JAVA_HOME/bin:$PATH"
```

Confira com `java -version` (deve mostrar 21).

## Como rodar

### 1. Banco de dados (uma vez só, na primeira execução)

```sh
brew install postgresql@17
brew services start postgresql@17

export PATH="$(brew --prefix postgresql@17)/bin:$PATH"
psql -d postgres -c "CREATE ROLE manutencao WITH LOGIN PASSWORD 'manutencao';"
createdb -O manutencao manutencao
psql -d manutencao -c "ALTER SCHEMA public OWNER TO manutencao;"
```

Confira: `PGPASSWORD=manutencao psql -h localhost -U manutencao -d manutencao -c '\conninfo'`

Depois disso o banco sobe sozinho junto com o sistema. Para parar:
`brew services stop postgresql@17`.

> **Quem preferir Docker** pode usar o `docker-compose.yml` da raiz em vez dos
> comandos acima: `docker compose up -d`. Ele sobe o mesmo PostgreSQL 17 com as
> mesmas credenciais, mais o Adminer em http://localhost:8081 para inspecionar as
> tabelas. As duas opções são equivalentes — o `application.properties` não muda.

### 2. Backend e frontend

Precisa de **2 terminais**.

```sh
# Terminal 1 — backend  ->  http://localhost:8080
cd backend
./mvnw spring-boot:run

# Terminal 2 — frontend ->  http://localhost:4200
cd frontend
nvm use
npm start
```

O frontend chama a API sempre por caminho relativo `/api/...`. Quem redireciona
para `localhost:8080` é o `proxy.conf.json`, então **não escreva URL absoluta**
(`http://localhost:8080/...`) dentro dos componentes — use `environment.apiUrl`.

## Comandos úteis

| Ação | Comando |
| --- | --- |
| Rodar backend | `cd backend && ./mvnw spring-boot:run` |
| Compilar backend | `cd backend && ./mvnw -DskipTests package` |
| Testes backend | `cd backend && ./mvnw test` |
| Rodar frontend | `cd frontend && npm start` |
| Build de produção do frontend | `cd frontend && npm run build` |
| Testes frontend | `cd frontend && npm test` |
| Gerar componente | `cd frontend && npx ng generate component features/<nome>/<componente>` |
| Gerar serviço | `cd frontend && npx ng generate service core/services/<nome>` |
| Abrir o banco no terminal | `psql -h localhost -U manutencao -d manutencao` |
| Parar o banco | `brew services stop postgresql@17` |

## Documentação da equipe

- [`docs/REQUISITOS.md`](docs/REQUISITOS.md) — RF001 a RF020 em tabela, com o que é obrigatório para a defesa
- [`docs/DIVISAO-DE-TAREFAS.md`](docs/DIVISAO-DE-TAREFAS.md) — quem faz o quê e em que ordem
- [`docs/BANCO.md`](docs/BANCO.md) — modelagem, migrations e massa de teste
- [`docs/CONVENCOES.md`](docs/CONVENCOES.md) — git, nomenclatura e contrato da API
- [`docs/SUPOSICOES.md`](docs/SUPOSICOES.md) — decisões que o enunciado não define (entrega obrigatória)
