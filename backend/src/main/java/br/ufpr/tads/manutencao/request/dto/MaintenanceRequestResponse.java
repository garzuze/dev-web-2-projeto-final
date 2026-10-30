package br.ufpr.tads.manutencao.request.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record MaintenanceRequestResponse(
    Long id,
    LocalDateTime openingDateTime,
    String statusName,
    Long clientId,
    String clientName,
    String categoryName,
    String equipmentDescription,
    String defectDescription,
    BigDecimal quoteValue,
    String rejectionReason,
    String currentEmployeeName,
    LocalDateTime maintenanceDateTime,
    String maintenanceDescription,
    String clientInstructions,
    LocalDateTime paymentDateTime,
    List<RequestHistoryResponse> history
) {
}