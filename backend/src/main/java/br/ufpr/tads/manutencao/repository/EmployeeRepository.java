package br.ufpr.tads.manutencao.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.ufpr.tads.manutencao.model.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

}
