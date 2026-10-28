package br.ufpr.tads.manutencao.request.repository;

import br.ufpr.tads.manutencao.report.dto.CategoryRevenue;
import br.ufpr.tads.manutencao.report.dto.DailyRevenue;
import br.ufpr.tads.manutencao.request.model.MaintenanceRequest;
import br.ufpr.tads.manutencao.request.model.RequestStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface MaintenanceRequestRepository extends JpaRepository<MaintenanceRequest, Long> {

    Optional<MaintenanceRequest> findByIdAndCustomerId(Long id, Long customerId);

    List<MaintenanceRequest> findByCustomerIdOrderByOpeningDateTimeAsc(Long customerId);

    @EntityGraph(attributePaths = {"customer", "category", "history"})
    List<MaintenanceRequest> findByStatusOrderByOpeningDateTimeAsc(RequestStatus status);


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

    @Query(value = """
          SELECT
                  c.name AS name,
                  SUM(mr.quote_value) AS total
              FROM maintenance_request mr
              JOIN category c ON c.id = mr.category_id
              WHERE mr.status IN ('PAGA', 'FINALIZADA')
              GROUP BY c.id, c.name
              ORDER BY total DESC
          """, nativeQuery = true)
    List<CategoryRevenue> findRevenueByCategory();

}
