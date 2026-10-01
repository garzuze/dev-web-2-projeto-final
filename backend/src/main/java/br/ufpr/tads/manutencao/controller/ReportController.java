package br.ufpr.tads.manutencao.controller;

import br.ufpr.tads.manutencao.dto.RevenueReport;
import br.ufpr.tads.manutencao.service.ReportService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

  private final ReportService reportService;

  public ReportController(ReportService reportService) {
    this.reportService = reportService;
  }

  @GetMapping("/revenue")
  public RevenueReport revenue(
          @RequestParam(required = false)
          @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
          LocalDate start,
          @RequestParam(required = false)
          @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
          LocalDate end

  ) {
    // exemplo de chamada: "/revenue?start=2026-09-29&end=2026-10-01"
    return reportService.revenueByDay(start, end);
  }
}
