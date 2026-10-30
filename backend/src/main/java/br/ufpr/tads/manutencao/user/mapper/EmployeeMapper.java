package br.ufpr.tads.manutencao.user.mapper;

import br.ufpr.tads.manutencao.user.dto.EmployeeRequest;
import br.ufpr.tads.manutencao.user.dto.EmployeeResponse;
import br.ufpr.tads.manutencao.user.model.Employee;

public class EmployeeMapper {
  public static Employee toEntity(EmployeeRequest request, String salt, String hash) {
    return Employee.builder()
            .name(request.name().trim())
            .email(request.email().trim().toLowerCase())
            .birthDate(request.birthDate())
            .passwordHash(hash)
            .salt(salt)
            .build();
  }

  public static EmployeeResponse toResponse(Employee employee) {
    return new EmployeeResponse(
            employee.getId(),
            employee.getName(),
            employee.getEmail(),
            employee.getBirthDate()
    );
  }

  public static void updateEntity(Employee employee, EmployeeRequest request) {
    employee.setName(request.name().trim());
    employee.setEmail(request.email().trim().toLowerCase());
    employee.setBirthDate(request.birthDate());
  }
}
