package br.ufpr.tads.manutencao.report.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record RevenueReport(
        LocalDate start,
        LocalDate end,
        List<DailyRevenue> days,
        BigDecimal total
) {

}
