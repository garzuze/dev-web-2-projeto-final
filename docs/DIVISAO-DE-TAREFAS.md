# Divisão de tarefas

Proposta para **7 pessoas**. Se a equipe tiver 6, veja "Ajustando para 6 pessoas"
no fim do documento.

## Princípio: fatia vertical

Cada pessoa entrega a **funcionalidade inteira**: entidade/repositório (quando
for dona dela) → serviço → endpoint REST → serviço Angular → tela. Ninguém fica
"só no front" ou "só no back".

Motivo: com fatia horizontal (uns fazendo backend, outros frontend) todo mundo
fica bloqueado esperando o outro, e na semana da entrega o front descobre que o
endpoint não existe. Com fatia vertical cada um consegue testar a própria parte
de ponta a ponta sozinho.

## Frentes

| # | Frente | Requisitos | Prioridade | O que entra |
| --- | --- | --- | --- | --- |
| 1 | **Fundação e cadastros base** | Modelo de dados, RF017, RF018 | **P0** | Entidades JPA, repositórios, migrations, massa de teste, CRUD de categoria e de funcionário (com as regras de "não remover a si mesmo" e "não remover o último"). Faz também a revisão dos PRs dos outros. |
| 2 | **Autenticação e casca do sistema** | RF001, RF002 | **P0** | Autocadastro com ViaCEP, senha aleatória de 4 dígitos por e-mail, hash SHA-256+salt, login, guard de rota, interceptor HTTP, layout base (menu, cabeçalho, rodapé) que todas as telas usam. |
| 3 | **Cliente — lista e detalhe** | RF003, RF008 | **P0** | Página inicial do cliente com a lógica de qual botão aparece em cada estado, e a tela de visualização com histórico completo. |
| 4 | **Cliente — solicitar e decidir orçamento** | RF004, RF005, RF006, RF007 | **P0** | Abertura da solicitação, tela de orçamento, aprovação e rejeição com motivo. |
| 5 | **Cliente — resgate e pagamento + relatórios** | RF009, RF010, RF016, RF019, RF020 | P1 | Resgatar serviço rejeitado, confirmar pagamento, finalizar solicitação e os dois relatórios em PDF. |
| 6 | **Funcionário — entrada e orçamento** | RF011, RF012, RF013 | **P0** | Página inicial do funcionário, tela de orçar, e a listagem com filtros (hoje/período/todas) e a escala de cores por estado. |
| 7 | **Funcionário — execução da manutenção** | RF014, RF015 | P1 | Efetuar manutenção (descrição + orientações) e redirecionar para outro funcionário, com histórico origem→destino. |

## Ordem de execução

Nem tudo pode começar junto — há dependências reais.

**Etapa 0 — antes de qualquer código (equipe inteira, 1 reunião)**
Fechar o modelo de dados no papel: entidades, atributos, relacionamentos e como o
histórico será guardado. Ver [`BANCO.md`](BANCO.md). Sem isso, cada um cria uma
entidade `Solicitacao` diferente e o merge vira um pesadelo.

**Etapa 1 — desbloqueio (frentes 1 e 2)**
A frente 1 sobe as entidades e repositórios; a frente 2 sobe login, guard e o
layout base. Enquanto isso, as frentes 3 a 7 montam **as telas com dados falsos
fixos no próprio componente** (sem chamar a API) e escrevem os DTOs que vão
precisar. Assim ninguém fica parado.

**Etapa 2 — fatias em paralelo (frentes 3 a 7)**
Cada um liga a sua tela ao backend de verdade e apaga os dados falsos.

**Etapa 3 — fechamento (equipe inteira)**
Massa de 20+ solicitações, checklist de requisitos não-funcionais, teste no
Firefox, `SUPOSICOES.md` exportado para `.doc`/`.odt`, ensaio da defesa.

## Regra de ouro para não haver conflito de merge

Cada frente trabalha **na própria pasta**:

- Backend: `controller/`, `service/`, `dto/`, `repository/` — um arquivo por frente,
  com nome da funcionalidade (`SolicitacaoController`, `OrcamentoService`, ...)
- Frontend: `src/app/features/<sua-feature>/` — ninguém mexe na pasta do outro

Arquivos **compartilhados** (mexer só combinando no grupo, de preferência em PR curto):

- `frontend/src/app/app.routes.ts`
- `frontend/src/app/app.config.ts`
- `backend/src/main/resources/application.properties`
- Entidades em `backend/.../model/` — donas da frente 1
- Migrations — nunca editar uma já aplicada, sempre criar a próxima

## Ajustando para 6 pessoas

Junte as frentes **5 e 7** em uma pessoa só (RF009, RF010, RF014, RF015, RF016) e
mova os relatórios PDF (RF019 e RF020) para a frente 1, que já domina o modelo de
dados e as queries.

## Ajustando se a equipe estiver atrasada

Priorize **somente os P0**: RF001 a RF006, RF011, RF012, RF017, RF018. São os
requisitos mínimos para ir à defesa. Só depois volte para os P1.
