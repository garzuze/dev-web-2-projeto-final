package br.ufpr.tads.manutencao.dto;

import java.time.LocalDate;
    
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
    
    public record EmployeeRequest(
    
            @NotBlank(message = "O nome é obrigatório")
            @Size(min = 2, max = 120, message = "O nome deve ter entre 2 e 120 caracteres")
            String name,
    
            @NotBlank(message = "O e-mail é obrigatório")
            @Email(message = "O e-mail deve ser válido")
            @Size(max = 150, message = "O e-mail deve ter no máximo 150 caracteres")
            String email,
    
            @NotNull(message = "A data de nascimento é obrigatória")
            @Past(message = "A data de nascimento deve ser uma data no passado")
            LocalDate birthDate
        ){

    }
