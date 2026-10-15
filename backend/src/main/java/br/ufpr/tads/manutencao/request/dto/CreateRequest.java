package br.ufpr.tads.manutencao.request.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateRequest(
    @NotBlank(message = "A descrição do equipamento é obrigatória.")
    @Size(min = 10, max = 200, message = "A descrição do equipamento deve ter entre 10 e 200 caracteres.")
    String equipmentDescription,

    @NotNull(message = "A categoria é obrigatória.")
    Long categoryId,

    @NotBlank(message = "A descrição do defeito é obrigatória.")
    @Size(min = 20, max = 2000, message = "A descrição do defeito deve ter entre 20 e 2000 caracteres.")
    String defectDescription
) {}
