package br.ufpr.tads.manutencao.request.repository;

import br.ufpr.tads.manutencao.report.dto.DailyRevenue;
import br.ufpr.tads.manutencao.request.model.MaintenanceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface MaintenanceRequestRepository extends JpaRepository<MaintenanceRequest, Long> {

    Optional<MaintenanceRequest> findByIdAndCustomerId(Long id, Long customerId);

    List<MaintenanceRequest> findByCustomerIdOrderByOpeningDateTimeAsc(Long customerId);


  @Query(value = """
          SELECT
                  CAST(payment_date_time AS DATE) AS day,
                  SUM(quote_value) AS total
              FROM maintenance_request
              WHERE status IN ('PAGA', 'FINALIZADA')
                AND (CAST(:startDate AS DATE) IS NULL OR payment_date_time >= CAST(:startDate AS DATE))
                AND (CAST(:endDate AS DATE) IS NULL OR payment_date_time < CAST(:endDate AS DATE) + INTERVAL '1 day')
              GROUP BY CAST(payment_date_time AS DATE)
              ORDER BY day
          """, nativeQuery = true)
  List<DailyRevenue> findDailyRevenue(
          @Param("startDate") LocalDate startDate,
          @Param("endDate") LocalDate endDate
  );

}
