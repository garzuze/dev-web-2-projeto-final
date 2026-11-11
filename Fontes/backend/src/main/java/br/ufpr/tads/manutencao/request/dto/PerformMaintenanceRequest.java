package br.ufpr.tads.manutencao.request.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PerformMaintenanceRequest(
    @NotBlank(message = "A descrição da manutenção é obrigatória.")
    @Size(max = 500, message = "A descrição da manutenção deve ter no máximo 500 caracteres.")
    String maintenanceDescription,

    @NotBlank(message = "As orientações para o cliente são obrigatórias.")
    @Size(max = 500, message = "As orientações para o cliente devem ter no máximo 500 caracteres.")
    String customerInstructions
) {}
