package br.ufpr.tads.manutencao.repository;

import br.ufpr.tads.manutencao.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepository extends JpaRepository<Address, Long> {

}
