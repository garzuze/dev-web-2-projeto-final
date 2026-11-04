package br.ufpr.tads.manutencao.request.mapper;

import br.ufpr.tads.manutencao.request.dto.CreateRequestHistory;
import br.ufpr.tads.manutencao.request.model.RequestHistory;

import java.time.LocalDateTime;

public class RequestHistoryMapper {
  public static RequestHistory toEntity(CreateRequestHistory requestHistory) {
    return RequestHistory.builder()
            .request(requestHistory.request())
            .previousStatus(requestHistory.previousStatus())
            .newStatus(requestHistory.newStatus())
            .author(requestHistory.author())
            .destinationEmployee(requestHistory.destinationEmployee())
            .dateTime(LocalDateTime.now())
            .notes(requestHistory.notes())
            .build();
  }
}
