package br.ufpr.tads.manutencao.user.dto;

import java.time.LocalDate;

public record EmployeeResponse(
        Long id,
        String name,
        String email,
        LocalDate birthDate) {
}
