package br.ufpr.tads.manutencao.request.repository;

import br.ufpr.tads.manutencao.request.model.RequestHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RequestHistoryRepository extends JpaRepository<RequestHistory, Long> {
    List<RequestHistory> findByRequestIdOrderByDateTimeAsc(Long requestId);
}