package br.ufpr.tads.manutencao.request.dto;

import br.ufpr.tads.manutencao.request.model.MaintenanceRequest;
import br.ufpr.tads.manutencao.request.model.RequestHistory;
import br.ufpr.tads.manutencao.request.model.RequestStatus;

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
    public MaintenanceRequestResponse(MaintenanceRequest req) {
        this(
            req.getId(),
            req.getOpeningDateTime(),
            req.getStatus().name(),
            req.getCustomer() != null ? req.getCustomer().getId() : null,
            req.getCustomer() != null ? req.getCustomer().getName() : null,
            req.getCategory().getName(),
            req.getEquipmentDescription(),
            req.getDefectDescription(),
            req.getQuoteValue(),
            req.getRejectionReason(),
            req.getEmployee() != null ? req.getEmployee().getName() : null,
            req.getHistory().stream()
                .filter(h -> h.getNewStatus() == RequestStatus.ARRUMADA)
                .map(RequestHistory::getDateTime)
                .reduce((a, b) -> b)
                .orElse(null),
            req.getMaintenanceDescription(),
            req.getCustomerInstructions(),
            req.getPaymentDateTime(),
            req.getHistory() != null ? req.getHistory().stream().map(RequestHistoryResponse::new).toList() : null
        );
    }
}