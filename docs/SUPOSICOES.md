# Suposições e decisões de projeto

> O enunciado exige: "Toda e qualquer suposição, que não esteja definida aqui e
> que a equipe faça, deve ser devidamente documentada e entregue em um arquivo
> .doc/.odt que acompanha o trabalho."
>
> **Este arquivo é entrega.** Preencham conforme as decisões forem tomadas e, no
> fim, exportem para `.doc`/`.odt`. Escrevam com as palavras de vocês — quem
> defende o trabalho precisa saber justificar cada linha daqui.

## Como registrar

Uma seção por suposição, no formato abaixo.

---

### S001 — [título curto da suposição]

**Contexto:** o que o enunciado diz (ou deixa de dizer) sobre isso.

**Suposição adotada:** o que a equipe decidiu.

**Justificativa:** por que essa decisão e não outra.

**Impacto:** o que muda no sistema por causa dela.

---

## Pontos que provavelmente vão virar suposição

Levantados na leitura do enunciado — confirmem, decidam e transformem em S00x:

- O enunciado não diz se um funcionário pode também ser cliente do sistema.
- O RF012 diz "Esse requisito vem do RF012" — provavelmente é erro de digitação e
  o correto é RF011. Confirmar com o professor.
- Não é definido o que acontece com uma solicitação REJEITADA que o cliente nunca
  resgata: ela fica parada para sempre?
- O RF018 (CRUD de funcionários) não define se qualquer funcionário pode criar
  outro funcionário ou se existe um perfil de administrador.
- Não é dito se o cliente pode cancelar uma solicitação ABERTA.
- O RF001 não define regra de formato do telefone (fixo, celular, com DDD).
- O RF019 e o RF020 não definem se "receita" considera solicitações PAGAS ou
  apenas FINALIZADAS.
- Não é definido o prazo/regra para o valor do orçamento poder ser alterado depois
  de emitido.
- O RF013 não diz se o funcionário vê solicitações FINALIZADAS na listagem "TODAS".
