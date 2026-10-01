package br.ufpr.tads.manutencao.repository;

import br.ufpr.tads.manutencao.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

  boolean existsByCpf(String cpf);

}
