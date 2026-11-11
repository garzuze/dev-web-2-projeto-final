package br.ufpr.tads.manutencao.request.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RejectRequest(
    @NotBlank(message = "O motivo da rejeição é obrigatório.")
    @Size (min=10, max=500, message = "O motivo da rejeição deve ter entre 10 e 500 caracteres.")
    String rejectionReason
) {}