package br.ufpr.tads.manutencao.dto;

import org.hibernate.validator.constraints.br.CPF;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record SignUpRequest(

        @NotBlank(message = "O CPF é obrigatório")
        @Pattern(regexp = "\\d{11}", message = "O CPF deve conter 11 dígitos, apenas números")
        @CPF(message = "O CPF informado não é válido")
        String cpf,

        @NotBlank(message = "O nome é obrigatório")
        @Size(max = 120, message = "O nome deve ter no máximo 120 caracteres")
        String name,

        @NotBlank(message = "O e-mail é obrigatório")
        @Email(message = "O e-mail informado não é válido")
        @Size(max = 150, message = "O e-mail deve ter no máximo 150 caracteres")
        String email,

        @NotBlank(message = "O telefone é obrigatório")
        @Pattern(regexp = "\\d{10,11}", message = "O telefone deve conter 10 ou 11 dígitos, apenas números")
        String phone,

        @NotNull(message = "O endereço é obrigatório")
        @Valid
        AddressRequest address) {

}
