package br.ufpr.tads.manutencao.request.dto;

import br.ufpr.tads.manutencao.request.model.RequestHistory;
import java.time.LocalDateTime;

public record RequestHistoryResponse(
    Long id,
    Long requestId,
    LocalDateTime dateTime,
    String previousStatus,
    String newStatus,
    String employeeName,
    String destinationEmployeeName,
    String notes
) {
    public RequestHistoryResponse(RequestHistory history) {
        this(
            history.getId(),
            history.getRequest().getId(),
            history.getDateTime(),
            history.getPreviousStatus() != null ? history.getPreviousStatus().name() : null,
            history.getNewStatus().name(),
            history.getAuthor() != null ? history.getAuthor().getName() : null,
            history.getDestinationEmployee() != null ? history.getDestinationEmployee().getName() : null,
            history.getNotes()
        );
    }
}