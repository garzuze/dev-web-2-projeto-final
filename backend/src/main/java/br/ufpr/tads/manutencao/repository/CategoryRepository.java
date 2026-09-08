package br.ufpr.tads.manutencao.repository;

import java.util.List;
import java.util.Optional;

import br.ufpr.tads.manutencao.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Customer.Category, Long> {

    List<Customer.Category> findByActiveTrueOrderByNameAsc();

    Optional<Customer.Category> findByNameIgnoreCaseAndActiveTrue(String name);

}
