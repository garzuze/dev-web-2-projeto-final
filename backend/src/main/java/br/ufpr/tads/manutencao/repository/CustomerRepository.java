package br.ufpr.tads.manutencao.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.ufpr.tads.manutencao.model.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

  boolean existsByCpf(String cpf);

}
