package br.ufpr.tads.manutencao.request.dto;

import jakarta.validation.constraints.NotNull;

public record RedirectRequest(
    @NotNull(message = "O funcionário de destino é obrigatório.")
    Long destinationEmployeeId
) {}
