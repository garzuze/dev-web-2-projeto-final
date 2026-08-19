# Convenções da equipe

Combinados para 7 pessoas mexerem no mesmo repositório sem se atropelar.
Ajustem o que quiserem, desde que todos sigam a mesma regra.

## Git

- `main` é branch protegida: nada de commit direto nela.
- Uma branch por requisito: `rf012-efetuar-orcamento`, `rf003-home-cliente`.
- Commits pequenos e em português: `feat: tela de orçamento do funcionário`,
  `fix: valida CPF duplicado no autocadastro`.
- Pull request pequeno, revisado por pelo menos uma pessoa antes do merge.
- `git pull --rebase origin main` antes de abrir o PR, para resolver conflito na
  sua branch e não na `main`.
- Nunca commitar: `node_modules/`, `target/`, `.env`, senha de e-mail real.

## Contrato da API REST

| Operação | Verbo | Caminho | Retorno |
| --- | --- | --- | --- |
| Listar | GET | `/api/solicitacoes` | 200 + lista |
| Buscar por id | GET | `/api/solicitacoes/{id}` | 200 ou 404 |
| Criar | POST | `/api/solicitacoes` | 201 + recurso criado |
| Atualizar | PUT | `/api/solicitacoes/{id}` | 200 |
| Desativar | DELETE | `/api/categorias/{id}` | 204 (soft delete) |
| Ação de negócio | POST | `/api/solicitacoes/{id}/aprovar` | 200 |

Regras:

- Recurso no **plural**, sem verbo no caminho — o verbo é o método HTTP. Exceção:
  transições de estado, que são ações (`/aprovar`, `/rejeitar`, `/pagar`,
  `/orcar`, `/finalizar`, `/redirecionar`, `/resgatar`).
- Controller **nunca** recebe nem devolve `@Entity` — sempre DTO. Isso evita
  vazar a estrutura do banco e quebrar o front quando a entidade mudar.
- Erro de validação retorna 400 com a lista de campos inválidos; erro de regra de
  negócio retorna 409 ou 422 com a mensagem; recurso inexistente retorna 404.
- Datas trafegam em ISO-8601 (`2026-08-19T14:30:00`). Quem formata para
  `19/08/2026 14:30` é o Angular, com `DatePipe` e locale pt-BR (já configurado).
- Valores monetários trafegam como número (`1234.56`). Quem formata para
  `R$ 1.234,56` é o `CurrencyPipe`.

## Camadas do backend

```
Controller  →  recebe HTTP, valida entrada (@Valid), devolve DTO. Sem regra de negócio.
Service     →  regra de negócio, transição de estado, @Transactional. É aqui que a lógica mora.
Repository  →  acesso a dados (Spring Data JPA). Sem regra de negócio.
Model       →  entidades JPA.
DTO         →  o que entra e sai da API.
```

Se você está escrevendo `if` de regra de negócio dentro do Controller, mova para
o Service. Se está montando SQL dentro do Service, mova para o Repository.

## Frontend

- Componentes **standalone** (padrão do Angular 17+, exigência do enunciado).
- Uma pasta por funcionalidade em `src/app/features/<nome>/`.
- Chamada HTTP só dentro de serviço em `core/services/`, nunca direto no
  componente.
- URL sempre relativa via `environment.apiUrl` (`/api`). Nunca
  `http://localhost:8080` escrito no código.
- Validação no formulário com Reactive Forms **e** no backend com Bean Validation
  — o enunciado exige nos dois lados.
- Nomes de arquivo no padrão `nome.component.ts`, `nome.service.ts` (foi como o
  projeto foi gerado, para bater com o material de aula).

## Java

- Classes em `PascalCase`, métodos e variáveis em `camelCase`, constantes em
  `UPPER_SNAKE_CASE`.
- Nada de atributo público: use `private` + getter/setter (ou Lombok, que já está
  no `pom.xml`).
- `BigDecimal` para dinheiro, `LocalDateTime` para data/hora.

## Antes de abrir PR

1. `cd backend && ./mvnw -DskipTests package` compila
2. `cd frontend && npm run build` compila
3. A tela funciona no **Firefox** (é onde o trabalho será avaliado)
4. Nenhum `console.log` ou `System.out.println` sobrando
