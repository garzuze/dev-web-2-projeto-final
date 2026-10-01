package br.ufpr.tads.manutencao.user.dto;

import br.ufpr.tads.manutencao.user.model.Employee;

import java.time.LocalDate;

public record EmployeeResponse(
        Long id,
        String name,
        String email,
        LocalDate birthDate) {
  public static EmployeeResponse of(Employee employee) {
    return new EmployeeResponse(
            employee.getId(),
            employee.getName(),
            employee.getEmail(),
            employee.getBirthDate()
    );
  }
} 
