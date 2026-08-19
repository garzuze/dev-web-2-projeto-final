# Requisitos — leitura destrinchada do enunciado

Fonte: [`enunciado.pdf`](enunciado.pdf). Em caso de divergência, vale o PDF.

## Estados da solicitação

```
ABERTA ──orçamento(RF012)──> ORÇADA ──aprovar(RF006)──> APROVADA ──manutenção(RF014)──> ARRUMADA
                               │                            ▲                              │
                               │ rejeitar(RF007)            │ resgatar(RF009)              │ pagar(RF010)
                               ▼                            │                              ▼
                           REJEITADA ───────────────────────┘                            PAGA
                                                                                           │
APROVADA ──redirecionar(RF015)──> REDIRECIONADA ──manutenção(RF014)──> ARRUMADA            │ finalizar(RF016)
                                                                                           ▼
                                                                                      FINALIZADA
```

**Toda** transição de estado precisa gerar um registro de histórico com data/hora
e o usuário responsável. É a exigência central do enunciado ("o histórico de
alteração de estado deve ser mantido") e o que o RF008 exibe.

## Requisitos funcionais

Legenda de prioridade: **P0** = exigido para a equipe poder ir à defesa · **P1** = restante.

| RF | Nome | Perfil | Prio | Resumo |
| --- | --- | --- | --- | --- |
| RF001 | Autocadastro | público | **P0** | CPF único, nome, e-mail único, endereço via CEP (API ViaCEP), telefone. Senha aleatória de 4 números enviada por e-mail. |
| RF002 | Login | público | **P0** | E-mail + senha; o sistema identifica o perfil sozinho. |
| RF003 | Página inicial do cliente | Cliente | **P0** | Lista das solicitações do cliente, ordem crescente de data/hora. Colunas: data/hora, descrição do equipamento (30 caracteres) e estado. Botão "Visualizar" (RF008) + botão de ação conforme o estado: ORÇADA→Aprovar/Rejeitar, APROVADA→nenhum, REJEITADA→Resgatar, ARRUMADA→Pagar, demais→Visualizar. |
| RF004 | Solicitação de manutenção | Cliente | **P0** | Descrição do equipamento, categoria e descrição do defeito. Nasce com data/hora e estado ABERTA. |
| RF005 | Mostrar orçamento | Cliente | **P0** | Tela com todos os dados da solicitação e o preço orçado em destaque, com botões Aprovar e Rejeitar. |
| RF006 | Aprovar serviço | Cliente | **P0** | Mensagem "Serviço Aprovado no Valor R$ xxxx", OK redireciona para a RF003. Estado → APROVADA. |
| RF007 | Rejeitar serviço | Cliente | P1 | Tela para digitar o motivo da rejeição; mensagem "Serviço Rejeitado". Estado → REJEITADA. |
| RF008 | Visualizar serviço | Cliente | P1 | Todos os dados da solicitação e, embaixo, o histórico completo (data/hora + funcionário que efetuou) + botões de ação. |
| RF009 | Resgatar serviço | Cliente | P1 | REJEITADA → APROVADA, registrando a transição no histórico. |
| RF010 | Pagar serviço | Cliente | P1 | Tela com dados e valor em destaque + botão que confirma o pagamento, gravando data/hora. Estado → PAGA. |
| RF011 | Página inicial do funcionário | Funcionário | **P0** | Todas as solicitações ABERTAS: data/hora, nome do cliente, descrição do produto (30 caracteres) e botão "Efetuar Orçamento". |
| RF012 | Efetuar orçamento | Funcionário | **P0** | Dados completos da solicitação e do cliente; funcionário informa o valor. Grava funcionário logado + data/hora. Estado → ORÇADA. |
| RF013 | Visualização de solicitações | Funcionário | P1 | Lista com filtro HOJE / PERÍODO (início e fim) / TODAS, ordem crescente por data/hora. Solicitações REDIRECIONADAS só aparecem para o funcionário destino. Cores: cinza=ABERTA, marrom=ORÇADA, vermelho=REJEITADA, amarelo=APROVADA, roxo=REDIRECIONADA, azul=ARRUMADA, alaranjado=PAGA, verde=FINALIZADA. Ações: ABERTA→RF012, APROVADA/REDIRECIONADA→RF014, PAGA→RF016. |
| RF014 | Efetuar manutenção | Funcionário | P1 | Dados da solicitação e do cliente; campos "Descrição da manutenção" e "Orientações para o cliente". Grava data/hora e funcionário. Estado → ARRUMADA. Ou aciona o RF015. |
| RF015 | Redirecionar manutenção | Funcionário | P1 | Escolhe outro funcionário em caixa de seleção. Estado → REDIRECIONADA, histórico com data/hora, funcionário origem e destino. Redirecionamentos infinitos; **não pode redirecionar para si mesmo**. |
| RF016 | Finalizar solicitação | Funcionário | P1 | Estado → FINALIZADA, com data/hora e funcionário responsável. |
| RF017 | CRUD de categoria de equipamento | Funcionário | **P0** | Inserir, remover, atualizar e listar (ex.: Notebook, Impressora, Desktop, Microfone). |
| RF018 | CRUD de funcionários | Funcionário | **P0** | E-mail único (login), nome, data de nascimento, senha. Não pode remover a si mesmo nem o último funcionário existente. |
| RF019 | Relatório de receitas em PDF | Funcionário | P1 | Filtro por data inicial e final (ambas podem ser vazias), agrupado por dia. |
| RF020 | Relatório de receitas por categoria em PDF | Funcionário | P1 | Desde sempre, agrupado por categoria de equipamento. |

## Requisitos não-funcionais (checklist de entrega)

- [ ] Leiaute de telas bem elaborado
- [ ] DHTML: html/xhtml, css, DOM e JavaScript
- [ ] Angular + REST + Spring Boot, com Repository, Serviços e padrões de projeto
- [ ] Banco relacional (PostgreSQL) — **usando PostgreSQL 17**
- [ ] Angular v17+ com **componentes standalone** — usando Angular 22, standalone por padrão
- [ ] Boas práticas de OO: ocultamento de informação, baixo acoplamento, nomes coerentes
- [ ] Framework de telas — **Tailwind CSS** (já configurado)
- [ ] Biblioteca JS para comportamento dinâmico de telas quando necessário
- [ ] Validação de **todos** os campos no front (Angular) **e** no back (Bean Validation)
- [ ] Senhas com hash **SHA-256 + SALT**
- [ ] Tabelas normalizadas em 3FN (exceto cidade/estado do endereço), com padrão de codificação
- [ ] Endereço preenchido automaticamente pela [API ViaCEP](https://viacep.com.br/)
- [ ] Endereço completo armazenado no banco
- [ ] Queries com JOINs, evitando N+1
- [ ] Protótipo com **todas** as funcionalidades implementadas e dados fictícios
- [ ] Datas e valores monetários entrados e exibidos no formato brasileiro
- [ ] Máscara em todos os campos formatados (CPF, telefone, CEP, moeda)
- [ ] Datas selecionáveis por calendário
- [ ] Toda remoção confirmada antes de ocorrer
- [ ] Remoção por **desativação do registro** (soft delete), nunca DELETE físico
- [ ] Testado no **Firefox** mais recente

## Massa de dados obrigatória

- 2 funcionários: Maria e Mário
- 4 clientes: João, José, Joana, Joaquina
- 5 categorias: Notebook, Desktop, Impressora, Mouse, Teclado
- **No mínimo 20 solicitações** com estados diferentes, datas distintas, funcionários
  e clientes diferentes, e histórico de alteração de status coerente

## Requisitos mínimos para a defesa

1. Angular (v17+, standalone) + Spring Boot + REST
2. Sistema rodando
3. API **integrada ao front** — API só testada no Postman é desconsiderada
4. Banco projetado, normalizado e implementado
5. Banco preenchido com dados relevantes
6. Funcionais de ponta a ponta, sem erro: RF001, RF002, RF003, RF004, RF005, RF006,
   RF011, RF012, RF017, RF018

> Qualquer suposição que a equipe fizer e que não esteja no enunciado **precisa ser
> documentada** e entregue em arquivo `.doc`/`.odt`. Anote em [`SUPOSICOES.md`](SUPOSICOES.md)
> conforme forem surgindo e exporte no fim.
