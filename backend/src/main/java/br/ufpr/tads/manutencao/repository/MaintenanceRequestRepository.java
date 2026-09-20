package br.ufpr.tads.manutencao.repository;

import br.ufpr.tads.manutencao.dto.DaillyRevenue;
import br.ufpr.tads.manutencao.model.MaintenanceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface MaintenanceRequestRepository extends JpaRepository<MaintenanceRequest, Long> {

    @Query(value = """
    -- TODO montar a query
    """, nativeQuery = true)
    List<DaillyRevenue> findDailyRevenue(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

}
