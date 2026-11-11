package br.ufpr.tads.manutencao.user.service;

import br.ufpr.tads.manutencao.user.model.Customer;
import br.ufpr.tads.manutencao.user.repository.CustomerRepository;
import org.springframework.stereotype.Service;

@Service
public class CustomerService {
  private final CustomerRepository customerRepository;

  public CustomerService(CustomerRepository customerRepository) {
    this.customerRepository = customerRepository;
  }

  public Customer getById(Long customerId) {
    return customerRepository.findById(customerId)
            .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
  }
}
