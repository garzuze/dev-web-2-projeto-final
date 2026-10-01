package br.ufpr.tads.manutencao.request.repository;

import br.ufpr.tads.manutencao.user.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepository extends JpaRepository<Address, Long> {

}
