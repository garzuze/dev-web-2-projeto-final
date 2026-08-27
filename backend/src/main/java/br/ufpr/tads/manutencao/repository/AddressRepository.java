package br.ufpr.tads.manutencao.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.ufpr.tads.manutencao.model.Address;

public interface AddressRepository extends JpaRepository<Address, Long> {

}
