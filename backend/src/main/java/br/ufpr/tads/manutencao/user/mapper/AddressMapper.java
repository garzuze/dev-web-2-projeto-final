package br.ufpr.tads.manutencao.user.mapper;

import br.ufpr.tads.manutencao.user.dto.AddressRequest;
import br.ufpr.tads.manutencao.user.model.Address;
import br.ufpr.tads.manutencao.user.model.Customer;

public class AddressMapper {
  public static Address toEntity(AddressRequest request, Customer customer) {
    return Address.builder()
            .customer(customer)
            .zipCode(request.zipCode())
            .street(request.street())
            .number(request.number())
            .complement(request.complement())
            .district(request.district())
            .city(request.city())
            .state(request.state())
            .build();
  }
}
