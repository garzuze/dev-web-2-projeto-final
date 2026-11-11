package br.ufpr.tads.manutencao.user.mapper;

import br.ufpr.tads.manutencao.auth.dto.SignUpRequest;
import br.ufpr.tads.manutencao.auth.dto.SignUpResponse;
import br.ufpr.tads.manutencao.user.model.Customer;

public class CustomerMapper {
  public static Customer toEntity(SignUpRequest request, String salt, String hash) {
    return Customer.builder()
            .name(request.name().trim())
            .email(request.email().trim().toLowerCase())
            .cpf(request.cpf())
            .phone(request.phone())
            .salt(salt)
            .passwordHash(hash)
            .build();
  }

  public static SignUpResponse toResponse(Customer customer) {
    return new SignUpResponse(customer.getId(), customer.getName(), customer.getEmail());
  }
}
