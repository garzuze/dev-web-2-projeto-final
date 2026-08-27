package br.ufpr.tads.manutencao.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(

        @NotBlank(message = "O e-mail é obrigatório")
        @Email(message = "O e-mail informado não é válido")
        String email,

        @NotBlank(message = "A senha é obrigatória")
        String password) {

}
