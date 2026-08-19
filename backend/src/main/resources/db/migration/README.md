# Migrations do Flyway

Enquanto `spring.flyway.enabled=false` (padrao atual), esta pasta fica vazia e
quem cria as tabelas e o Hibernate (`ddl-auto=update`).

Quando o modelo de dados estiver fechado:

1. Suba o banco limpo e deixe o Hibernate gerar o schema uma ultima vez.
2. Exporte o DDL gerado (`docker compose exec db pg_dump -U manutencao -s manutencao`)
   e salve aqui como `V1__init.sql`, revisando nomes e restricoes na mao.
3. Crie `V2__seed.sql` com a massa de teste exigida pelo enunciado
   (2 funcionarios, 4 clientes, 5 categorias, 20+ solicitacoes com historico).
4. Em `application.properties`: `spring.flyway.enabled=true` e
   `spring.jpa.hibernate.ddl-auto=validate`.

Regras de nome: `V<numero>__<descricao_com_underline>.sql`. Numero nunca se
repete e migration ja aplicada nunca e editada - cria-se uma nova.
