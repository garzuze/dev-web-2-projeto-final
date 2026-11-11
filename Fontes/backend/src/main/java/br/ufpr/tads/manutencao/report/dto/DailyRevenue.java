package br.ufpr.tads.manutencao.report.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public interface DailyRevenue {
  LocalDate getDay();

  BigDecimal getTotal();
}
