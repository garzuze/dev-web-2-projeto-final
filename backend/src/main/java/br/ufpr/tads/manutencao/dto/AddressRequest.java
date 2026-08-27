package br.ufpr.tads.manutencao.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record AddressRequest(

    @NotBlank(message = "O CEP é obrigatório")
    @Pattern(regexp = "\\d{8}", message = "O CEP deve conter 8 dígitos, apenas números")
    String zipCode,

    @NotBlank(message = "A rua é obrigatória")
    @Size(max = 150, message = "A rua deve ter no máximo 150 caracteres")
    String street,

    @NotBlank(message = "O número é obrigatório")
    @Size(max = 10, message = "O número deve ter no máximo 10 caracteres")
    String number,

    @Size(max = 60, message = "O complemento deve ter no máximo 60 caracteres")
    String complement,

    @NotBlank(message = "O bairro é obrigatório")
    @Size(max = 80, message = "O bairro deve ter no máximo 80 caracteres")
    String district,

    @NotBlank(message = "A cidade é obrigatória")
    @Size(max = 80, message = "A cidade deve ter no máximo 80 caracteres")
    String city,

    @NotBlank(message = "O estado é obrigatório")
    @Pattern(regexp = "[A-Z]{2}", message = "O estado deve ser a sigla de duas letras maiúsculas")
    String state) {

}
