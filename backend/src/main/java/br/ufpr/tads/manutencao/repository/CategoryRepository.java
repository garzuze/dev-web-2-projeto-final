package br.ufpr.tads.manutencao.repository;

import java.util.List;
import java.util.Optional;

import br.ufpr.tads.manutencao.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findByActiveTrueOrderByNameAsc();

    Optional<Category> findByNameIgnoreCaseAndActiveTrue(String name);

}
