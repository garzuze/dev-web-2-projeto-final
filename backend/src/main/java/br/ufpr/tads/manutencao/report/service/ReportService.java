package br.ufpr.tads.manutencao.report.service;

import br.ufpr.tads.manutencao.report.dto.DailyRevenue;
import br.ufpr.tads.manutencao.report.dto.RevenueReport;
import br.ufpr.tads.manutencao.repository.MaintenanceRequestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

@Service
public class ReportService {

  private final MaintenanceRequestRepository requestRepository;


  public ReportService(MaintenanceRequestRepository requestRepository) {
    this.requestRepository = requestRepository;
  }

  @Transactional(readOnly = true)
  public RevenueReport revenueByDay(LocalDate start, LocalDate end) {

    List<DailyRevenue> revenues = requestRepository.findDailyRevenue(start, end);

    LocalDate resolvedStart = start != null ? start : firstDayOf(revenues);
    LocalDate resolvedEnd = end != null ? end : LocalDate.now();

    BigDecimal total = revenues.stream()
            .map(DailyRevenue::getTotal)
            .filter(Objects::nonNull)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

    return new RevenueReport(resolvedStart, resolvedEnd, revenues, total);
  }

  private LocalDate firstDayOf(List<DailyRevenue> revenues) {
    return revenues.isEmpty() ? null : revenues.getFirst().getDay();
  }

}
