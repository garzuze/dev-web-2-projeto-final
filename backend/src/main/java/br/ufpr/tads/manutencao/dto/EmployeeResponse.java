package br.ufpr.tads.manutencao.dto;

import java.time.LocalDate;

import br.ufpr.tads.manutencao.model.Employee;

public record EmployeeResponse(
    Long id,
    String name,
    String email,
    LocalDate birthDate){
    public static EmployeeResponse of(Employee employee){
        return new EmployeeResponse(
            employee.getId(),
            employee.getName(), 
            employee.getEmail(), 
            employee.getBirthDate()
        );
    } 
} 
