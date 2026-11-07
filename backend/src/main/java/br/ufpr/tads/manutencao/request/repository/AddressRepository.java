package br.ufpr.tads.manutencao.request.repository;

import br.ufpr.tads.manutencao.user.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AddressRepository extends JpaRepository<Address, Long> {
    Optional<Address> findByCustomerId(Long customerId);
}
