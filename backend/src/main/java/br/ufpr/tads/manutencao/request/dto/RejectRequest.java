package br.ufpr.tads.manutencao.request.dto;

import jakarta.validation.constraints.NotBlank;

public record RejectRequest(
    @NotBlank(message = "O motivo da rejeição é obrigatório.")
    String rejectionReason
) {}