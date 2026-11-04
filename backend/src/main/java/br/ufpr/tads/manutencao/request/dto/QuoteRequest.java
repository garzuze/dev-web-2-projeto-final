package br.ufpr.tads.manutencao.request.dto;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record QuoteRequest(
        @NotNull(message = "O valor do orçamento é obrigatório.") @Positive(message = "O valor do orçamento deve ser maior que zero.") @Digits(integer = 5, fraction = 2, message = "O valor do orçamento deve ser de no máximo R$ 99.999,99 (até 5 dígitos inteiros e 2 casas decimais).") BigDecimal quoteValue) {
}
