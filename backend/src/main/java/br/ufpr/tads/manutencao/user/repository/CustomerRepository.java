package br.ufpr.tads.manutencao.user.repository;

import br.ufpr.tads.manutencao.user.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

  boolean existsByCpf(String cpf);

}
