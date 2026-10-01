package br.ufpr.tads.manutencao.repository;

import br.ufpr.tads.manutencao.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

  List<Employee> findByActiveTrueOrderByNameAsc();

  long countByActiveTrue();
}
