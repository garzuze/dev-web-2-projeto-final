package br.ufpr.tads.manutencao.request.service;

import br.ufpr.tads.manutencao.request.dto.CreateRequestHistory;
import br.ufpr.tads.manutencao.request.mapper.RequestHistoryMapper;
import br.ufpr.tads.manutencao.request.model.RequestHistory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class RequestHistoryService {
  public void register(CreateRequestHistory requestHistory) {
    register(requestHistory, LocalDateTime.now());
  }

  public void register(CreateRequestHistory requestHistory, LocalDateTime dateTime) {
    RequestHistory history = RequestHistoryMapper.toEntity(requestHistory, dateTime);
    requestHistory.request().addHistory(history);
  }
}
