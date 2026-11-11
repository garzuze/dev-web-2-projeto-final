package br.ufpr.tads.manutencao.report.dto;

import java.math.BigDecimal;
import java.util.List;

public record CategoryRevenueReport(
        List<CategoryRevenue> categories,
        BigDecimal total
) {

}
