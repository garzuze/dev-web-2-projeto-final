# Banco de dados

PostgreSQL 17. Credenciais de desenvolvimento (iguais para todo mundo):

```
host: localhost   porta: 5432
base: manutencao  usuário: manutencao  senha: manutencao
```

## Estado atual da configuração

Hoje o `application.properties` está com `spring.jpa.hibernate.ddl-auto=update`
e o Flyway **desligado**. Ou seja: o Hibernate cria e altera as tabelas sozinho a
partir das classes `@Entity`.

Isso é proposital para a fase em que o modelo ainda muda todo dia. **Não é o que
será entregue** — o enunciado exige banco "projetado, normalizado e implementado".
Quando o modelo estabilizar, siga o roteiro em
`backend/src/main/resources/db/migration/README.md` para passar o schema para o
Flyway e trocar `ddl-auto` para `validate`.

## O que precisa ser decidido pela equipe (etapa 0)

O enunciado não fecha estes pontos. Decidam em grupo, anotem a decisão e o motivo
em [`SUPOSICOES.md`](SUPOSICOES.md):

1. **Cliente e Funcionário** — duas tabelas independentes, ou uma tabela `usuario`
   com herança/discriminador? Os dois têm e-mail único usado para login, mas
   Cliente tem CPF, endereço e telefone, e Funcionário tem data de nascimento.
2. **Histórico de estados** — o enunciado exige guardar todas as transições com
   data/hora e responsável. Uma tabela de histórico com estado anterior, estado
   novo, data/hora, usuário e campos específicos (motivo da rejeição, valor do
   orçamento, descrição da manutenção, funcionário destino do redirecionamento)?
   Ou uma tabela por tipo de evento? Lembre que o RF008 tem que renderizar tudo
   isso em ordem cronológica.
3. **Estado da solicitação** — enum no Java (`@Enumerated(EnumType.STRING)`) ou
   tabela `estado_solicitacao` no banco? O enunciado diz que tabelas sem cadastro
   também devem existir e vir previamente preenchidas — o que puxa para tabela.
4. **Endereço** — tabela própria ou colunas na tabela do cliente? O enunciado
   dispensa normalizar cidade e estado, mas exige guardar o endereço completo.
5. **Soft delete** — coluna `ativo boolean` ou `data_desativacao timestamp`?
   Tem que valer para categoria e funcionário (RF017 e RF018) e todas as consultas
   precisam filtrar os inativos.
6. **Valores monetários** — `NUMERIC(10,2)` no banco e `BigDecimal` no Java.
   Nunca `double` ou `float` para dinheiro.
7. **Padrão de nomes** — definam um só e sigam: tabelas no singular ou plural,
   `snake_case`, chave primária `id` ou `id_solicitacao`, chave estrangeira
   `cliente_id`. Escrevam a regra aqui embaixo para ninguém inventar.

## Padrão de nomenclatura adotado

> Preencher na etapa 0.

## Massa de teste

Exigência do enunciado, e vale nota na defesa:

- 2 funcionários: Maria e Mário
- 4 clientes: João, José, Joana, Joaquina
- 5 categorias: Notebook, Desktop, Impressora, Mouse, Teclado
- 20+ solicitações cobrindo **todos** os oito estados, com datas distintas,
  clientes e funcionários diferentes, e histórico coerente (uma solicitação PAGA
  precisa ter passado por ABERTA → ORÇADA → APROVADA → ARRUMADA → PAGA, com
  data/hora crescente em cada passo)

Enquanto o Flyway estiver desligado, a massa pode ficar em
`backend/src/main/resources/data.sql` (o Spring roda automaticamente). Depois ela
vira uma migration `V2__seed.sql`.

## Cuidados de desempenho exigidos pelo enunciado

- Listagens que mostram dados do cliente junto da solicitação (RF011, RF013)
  devem usar `JOIN FETCH` ou uma projeção/DTO na query, senão o JPA dispara uma
  consulta por linha (problema N+1).
- `spring.jpa.show-sql=true` já está ligado: olhem o console e contem quantos
  SELECTs cada tela dispara. Se uma lista de 20 linhas gera 21 queries, é N+1.
